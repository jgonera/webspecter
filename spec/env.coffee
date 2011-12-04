exports.config =
  baseUrl: 'http://localhost:4567'
  
exports.global =
  pageTitle: -> $('title').text
  quack: -> 'quack quack'
  $: -> 'evil! global overwritten!'
