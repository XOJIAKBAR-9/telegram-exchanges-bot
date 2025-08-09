export const handler = async function (event) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Netlify function is working!',
      timestamp: new Date().toISOString(),
      method: event.httpMethod,
      path: event.path,
    }),
  };
};
