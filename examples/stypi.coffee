feature "Stypi collaborative editing", (context) ->
  alice = context.newContext()
  bob = context.newContext()

  before (done) ->
    alice.browser.visit 'https://www.stypi.com/', ->
      bob.browser.visit alice.browser.url, done

  after ->
    console.log "\tCheck for yourself: #{alice.browser.url}"

  it "shows other user's text", (done) ->
    oldText = alice.$('#editor').text
    alice.$('#editor').click()
    alice.$('#editor').type 'hello Bob'
    wait.until (-> bob.$('#editor').text != oldText), ->
      #bob.browser.page.render 'bob.png'
      done()
