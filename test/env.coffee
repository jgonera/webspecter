exports.config =
  baseUrl: 'http://localhost:4567'
  
exports.selectors =
  tea: (query) -> xpath: "//*[text()='#{query} tea']"

exports.global =
  pageTitle: -> $('title').text
  quack: -> 'quack quack'
  $: -> 'evil! global overwritten!'
