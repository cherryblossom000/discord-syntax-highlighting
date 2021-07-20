hljs.debugMode()
hljs.highlightAll()

for (const category of document.querySelectorAll('.categories > li')) {
  category.addEventListener('click', event => {
    const current = document.querySelector('.categories .current')
    const currentCategory = current.dataset.category
    const nextCategory = event.target.dataset.category

    if (currentCategory !== nextCategory) {
      current.classList.remove('current')
      event.target.classList.add('current')

      document
        .querySelectorAll(`.${currentCategory}`)
        .forEach(language => language.classList.add('hidden'))
      document
        .querySelectorAll(`.${nextCategory}`)
        .forEach(language => language.classList.remove('hidden'))

      window.scrollTo(0, 0)
    }
  })
}

document.getElementById('light-theme').addEventListener('input', () => {
  document.documentElement.classList.toggle('theme-dark')
  document.documentElement.classList.toggle('theme-light')
})
