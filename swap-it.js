if (window.self === window.top) {
  const iframe = document.createElement('iframe')
  iframe.setAttribute('hidden', 'true')
  iframe.setAttribute('name', 'swap-it')
  iframe.addEventListener('load', () => {
    setTimeout(() => {
      const href = iframe.contentWindow.location.href
      if (href === 'about:blank') {
        return
      }
      const url = new URL(href)
      const swap = url.searchParams.get('swap')
      url.searchParams.delete('swap')

      document.getElementById(swap)?.replaceWith(iframe.contentDocument.getElementById(swap))

      history.replaceState(null, null, url.toString())

      document.body.classList.remove('loading')
    })
  })

  document.body.appendChild(iframe)

  const withSwapParam = (href, swap) => {
    const url = new URL(href)
    url.searchParams.set('swap', swap)
    return url.toString()
  }

  document.body.addEventListener('submit', (e) => {
    if (e.target.matches('[data-swap]') || e.submitter.matches('[data-swap]')) {
      const swap = e.submitter.getAttribute('data-swap') || e.target.getAttribute('data-swap')
      const formAction = e.submitter.getAttribute('formaction')
      const action = e.target.getAttribute('action')
      const formTarget = e.submitter.getAttribute('formtarget')
      const target = e.target.getAttribute('target')

      if (formAction) {
        e.submitter.formAction = withSwapParam(e.submitter.formAction, swap)
        setTimeout(() => {
          e.submitter.setAttribute('formaction', formAction)
        })
      } else {
        e.target.action = withSwapParam(e.target.action, swap)
        setTimeout(() => {
          e.target.setAttribute('action', action)
        })
      }

      if (formTarget) {
        e.submitter.setAttribute('formtarget', 'swap-it')
        setTimeout(() => {
          e.submitter.setAttribute('formtarget', formTarget)
        })
      } else {
        e.target.setAttribute('target', 'swap-it')
        setTimeout(() => {
          if (target) {
            e.target.setAttribute('target', target)
          } else {
            e.target.removeAttribute('target')
          }
        })
      }
    }
  })

  document.body.addEventListener('click', (e) => {
    if (e.target.matches('a[data-swap]')) {
      document.body.classList.add('loading')
      const href = e.target.getAttribute('href')
      e.target.href = withSwapParam(e.target.href, e.target.getAttribute('data-swap'))
      const target = e.target.getAttribute('target')
      e.target.setAttribute('target', 'swap-it')
      setTimeout(() => {
        if (target) {
          e.target.setAttribute('target', target)
        } else {
          e.target.removeAttribute('target')
        }
        e.target.setAttribute('href', href)
      })
    }
  })
}


