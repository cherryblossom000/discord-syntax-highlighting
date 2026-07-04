// NodeListOf<HTMLLIElement> is different to NodeListOf<Element>
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- ^
for (const category of document.querySelectorAll(
	'.categories > li',
) as NodeListOf<HTMLLIElement>) {
	category.addEventListener('click', ev => {
		const target = ev.target as HTMLLIElement
		// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style -- HTMLLIElement is different to Element
		const current = document.querySelector(
			'.categories .current',
		) as HTMLLIElement
		const currentCategory = current.dataset.category
		const nextCategory = target.dataset.category

		if (currentCategory !== nextCategory) {
			current.classList.remove('current')
			target.classList.add('current')

			for (const language of document.querySelectorAll(`.${currentCategory}`))
				language.classList.add('hidden')
			for (const language of document.querySelectorAll(`.${nextCategory}`))
				language.classList.remove('hidden')

			window.scrollTo(0, 0)
		}
	})
}

const themeSelect = document.getElementById('theme-select') as HTMLSelectElement
themeSelect.addEventListener('input', () => {
	document.body.dataset.theme = themeSelect.value
})

// Search
const searchInput = document.getElementById('language-search') as HTMLInputElement
const clearBtn = document.getElementById('search-clear') as HTMLButtonElement
const languageCards = document.querySelectorAll('main > div') as NodeListOf<HTMLDivElement>

function clearSearch(): void {
	searchInput.value = ''
	clearBtn.classList.add('hidden')

	// Remove all search highlights
	for (const card of languageCards) card.classList.remove('search-highlight')

	// Restore category view
	const current = document.querySelector('.categories .current') as HTMLLIElement
	const currentCategory = current.dataset.category!
	for (const card of languageCards) {
		if (card.classList.contains(currentCategory)) {
			card.classList.remove('hidden')
		} else {
			card.classList.add('hidden')
		}
	}
}

searchInput.addEventListener('input', () => {
	const query = searchInput.value.trim().toLowerCase()

	if (!query) {
		clearSearch()
		return
	}

	clearBtn.classList.remove('hidden')
	let firstMatch: HTMLDivElement | null = null

	for (const card of languageCards) {
		const heading = card.querySelector('h2')
		if (!heading) continue
		const text = heading.textContent?.toLowerCase() ?? ''

		if (text.includes(query)) {
			card.classList.remove('hidden')
			card.classList.add('search-highlight')
			if (!firstMatch) firstMatch = card
		} else {
			card.classList.add('hidden')
			card.classList.remove('search-highlight')
		}
	}

	if (firstMatch) firstMatch.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

clearBtn.addEventListener('click', () => {
	clearSearch()
	searchInput.focus()
})
