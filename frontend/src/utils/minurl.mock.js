export function urlToPath(url) {
    // Simula a conversão de URL para caminho
    return url.replace('file://', '');
  }
  
  export function isUrl(value) {
    return typeof value === 'string' && value.startsWith('http');
  }
  