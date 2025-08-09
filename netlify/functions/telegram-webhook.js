import TelegramBot from 'node-telegram-bot-api';
import { v4 as uuidv4 } from 'uuid';
import {
  TextractClient,
  DetectDocumentTextCommand,
} from '@aws-sdk/client-textract';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import https from 'https';

// Initialize AWS clients
const textractClient = new TextractClient({
  region: process.env.MYAWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.MYAWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MYAWS_SECRET_ACCESS_KEY,
  },
});

const s3Client = new S3Client({
  region: process.env.MYAWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.MYAWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MYAWS_SECRET_ACCESS_KEY,
  },
});

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// Helper function to download file from Telegram
async function downloadFile(filePath) {
  const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;

  return new Promise((resolve, reject) => {
    https
      .get(fileUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download file: ${response.statusCode}`));
          return;
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      })
      .on('error', reject);
  });
}

// AWS helper functions
async function uploadToS3(buffer, fileName, contentType) {
  const uploadParams = {
    Bucket: process.env.MYAWS_S3_BUCKET,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
}

async function deleteFromS3(fileName) {
  try {
    const deleteParams = {
      Bucket: process.env.MYAWS_S3_BUCKET,
      Key: fileName,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    console.error('Failed to delete S3 file:', error);
  }
}

async function extractTextFromS3(fileName) {
  const textractParams = {
    Document: {
      S3Object: {
        Bucket: process.env.MYAWS_S3_BUCKET,
        Name: fileName,
      },
    },
  };

  const command = new DetectDocumentTextCommand(textractParams);
  const response = await textractClient.send(command);

  // Extract text from blocks
  let extractedText = '';
  if (response.Blocks) {
    const textBlocks = response.Blocks.filter(
      (block) => block.BlockType === 'LINE'
    );
    extractedText = textBlocks
      .map((block) => block.Text)
      .filter((text) => text)
      .join('\n');
  }

  return extractedText;
}

export const handler = async function (event) {
  console.log('Webhook received:', JSON.stringify(event, null, 2));

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const body = JSON.parse(event.body);
    console.log('Parsed body:', JSON.stringify(body, null, 2));

    const message = body.message;

    if (!message || !message.chat) {
      console.log('No valid message found, ignoring');
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'ignored' }),
      };
    }

    const chatId = message.chat.id;
    console.log('Processing message from chat:', chatId);

    // Handle text messages
    if (message.text) {
      if (message.text === '/start') {
        await bot.sendMessage(
          chatId,
          "👋 Welcome! Send me a photo or PDF and I'll extract the text for you."
        );
      } else {
        await bot.sendMessage(chatId, `You said: ${message.text}`);
      }
    }
    // Handle photos
    else if (message.photo && message.photo.length > 0) {
      const photo = message.photo[message.photo.length - 1]; // Get the largest photo
      console.log('Photo received:', photo);

      await bot.sendMessage(
        chatId,
        "📸 Photo received! I'm processing it to extract text..."
      );

      try {
        // Get file info
        const file = await bot.getFile(photo.file_id);
        console.log('File info:', file);

        // Download the file
        const fileBuffer = await downloadFile(file.file_path);

        // Upload to S3
        const fileName = `${uuidv4()}-photo.jpg`;
        await uploadToS3(fileBuffer, fileName, 'image/jpeg');

        // Extract text using Textract
        const extractedText = await extractTextFromS3(fileName);

        // Clean up S3 file
        await deleteFromS3(fileName);

        if (extractedText && extractedText.trim()) {
          await bot.sendMessage(
            chatId,
            `📝 Extracted text:\n\n${extractedText}`
          );
        } else {
          await bot.sendMessage(
            chatId,
            '❌ No text found in the image. Please try with a clearer image or one with more text.'
          );
        }
      } catch (error) {
        console.error('Error processing photo:', error);
        await bot.sendMessage(
          chatId,
          "❌ Sorry, I couldn't process the photo. Please try again."
        );
      }
    }
    // Handle documents (PDFs, etc.)
    else if (message.document) {
      console.log('Document received:', message.document);

      // Check if it's a PDF
      if (message.document.mime_type !== 'application/pdf') {
        await bot.sendMessage(
          chatId,
          '❌ I only support PDF documents. Please send a PDF file.'
        );
        return {
          statusCode: 200,
          body: JSON.stringify({ status: 'ok' }),
        };
      }

      await bot.sendMessage(
        chatId,
        "📄 PDF received! I'm processing it to extract text..."
      );

      try {
        // Get file info
        const file = await bot.getFile(message.document.file_id);
        console.log('File info:', file);

        // Download the file
        const fileBuffer = await downloadFile(file.file_path);

        // Upload to S3
        const fileName = `${uuidv4()}-${message.document.file_name}`;
        await uploadToS3(fileBuffer, fileName, 'application/pdf');

        // Extract text using Textract
        const extractedText = await extractTextFromS3(fileName);

        // Clean up S3 file
        await deleteFromS3(fileName);

        if (extractedText && extractedText.trim()) {
          await bot.sendMessage(
            chatId,
            `📝 Extracted text:\n\n${extractedText}`
          );
        } else {
          await bot.sendMessage(
            chatId,
            '❌ No text found in the PDF. Please try with a different document.'
          );
        }
      } catch (error) {
        console.error('Error processing document:', error);
        await bot.sendMessage(
          chatId,
          "❌ Sorry, I couldn't process the document. Please try again."
        );
      }
    }
    // Handle other message types
    else {
      await bot.sendMessage(
        chatId,
        '❓ I can only process text messages, photos, and PDF documents. Please send one of those!'
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'ok' }),
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
