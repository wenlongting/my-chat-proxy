export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const { targetUrl, apiKey, body: requestBody } = request.body;
    if (!targetUrl || !apiKey || !requestBody) {
      return response.status(400).json({ message: 'Missing required parameters' });
    }
    const finalUrl = `${targetUrl}?key=${apiKey}`;
    const apiResponse = await fetch(finalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const data = await apiResponse.json();
    if (!apiResponse.ok) {
      return response.status(apiResponse.status).json(data);
    }
    response.status(200).json(data);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'An internal server error occurred.' });
  }
}
