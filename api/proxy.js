export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 从前端请求中获取更多参数，包括请求方法(method)
    const { targetUrl, apiKey, method, body: requestBody } = request.body;

    if (!targetUrl || !apiKey) {
      return response.status(400).json({ message: 'Missing required parameters: targetUrl or apiKey' });
    }

    // 根据目标是Google还是OpenAI来决定如何构造URL和请求头
    let finalUrl = targetUrl;
    const headers = {
      'Content-Type': 'application/json',
    };

    if (targetUrl.includes('googleapis.com')) {
      finalUrl = `${targetUrl}?key=${apiKey}`;
    } else {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    // 使用前端指定的method (GET/POST) 来发起请求
    const apiResponse = await fetch(finalUrl, {
      method: method || 'GET', // 如果前端没指定，默认为GET
      headers: headers,
      // 只有在POST等需要body的请求中才附加body
      body: (method === 'POST' && requestBody) ? JSON.stringify(requestBody) : undefined,
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return response.status(apiResponse.status).json(data);
    }

    response.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    response.status(500).json({ message: 'An internal server error occurred.' });
  }
}
