hljs.debugMode()
hljs.highlightAll()

for (const category of document.querySelectorAll('.categories > li')) {
  category.addEventListener('click', ev => {
    const current = document.querySelector('.categories .current')
    const currentCategory = current.dataset.category
    const nextCategory = ev.target.dataset.category

    if (currentCategory !== nextCategory) {
      current.classList.remove('current')
      ev.target.classList.add('current')

      for (const language of document.querySelectorAll(`.${currentCategory}`))
        language.classList.add('hidden')
      for (const language of document.querySelectorAll(`.${nextCategory}`))
        language.classList.remove('hidden')

      window.scrollTo(0, 0)
    }
  })
}

document.getElementById('light-theme').addEventListener('input', () => {
  document.documentElement.classList.toggle('theme-dark')
  document.documentElement.classList.toggle('theme-light')
})
