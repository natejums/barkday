import { useEffect, useState } from 'react'
import { ClassicView } from './classic/ClassicView'
import { DeepView } from './deep/DeepView'

type Theme = 'system' | 'light' | 'dark'
type Tab = 'classic' | 'deep'

const REPO_URL = 'https://github.com/natejums/barkday'

/** The hashes that open the 2.0 tab. `#2.0` is the one we link to. */
const DEEP_HASHES = new Set(['#2.0', '#2', '#v2', '#deep', '#/2.0'])

function tabFromHash(hash: string): Tab {
  return DEEP_HASHES.has(hash.toLowerCase()) ? 'deep' : 'classic'
}

export function App() {
  const [theme, setTheme] = useState<Theme>('system')
  const [tab, setTab] = useState<Tab>(() =>
    typeof window === 'undefined' ? 'classic' : tabFromHash(window.location.hash),
  )

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
  }, [theme])

  // The tab lives in the URL hash, so 2.0 can be linked to and the back button works.
  useEffect(() => {
    function onHashChange() {
      setTab(tabFromHash(window.location.hash))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function choose(next: Tab) {
    setTab(next)
    const hash = next === 'deep' ? '#2.0' : ''
    if (typeof window !== 'undefined' && window.location.hash !== hash) {
      // Replace rather than push for the classic tab, so clearing the hash doesn't
      // leave a bare "#" in the address bar.
      if (hash) window.location.hash = hash
      else window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }

  return (
    <div className="page">
      <header className="masthead">
        <div>
          <h1 className="masthead__title">
            <svg
              className="masthead__mark"
              viewBox="0 0 32 32"
              width="28"
              height="28"
              fill="currentColor"
              aria-hidden="true"
            >
              <ellipse cx="7" cy="13" rx="3" ry="3.9" />
              <ellipse cx="13.6" cy="8.4" rx="3.2" ry="4.3" />
              <ellipse cx="20.6" cy="8.4" rx="3.2" ry="4.3" />
              <ellipse cx="27" cy="13" rx="3" ry="3.9" />
              <ellipse cx="17" cy="23" rx="7.6" ry="6.6" />
            </svg>
            Barkday
          </h1>
          <p className="masthead__tagline">
            <strong>The world's best dog age calculator.</strong> A dog's age in human years depends
            on their size, their breed, their weight and how they live — not on multiplying by
            seven. Classic gives you the number and the reasons; 2.0 goes deeper, with a report
            built around helping your dog live their best life.
          </p>
        </div>

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
        >
          {theme === 'system' ? 'Theme: auto' : theme === 'dark' ? 'Theme: dark' : 'Theme: light'}
        </button>
      </header>

      <div className="tabs" role="tablist" aria-label="Calculator version">
        <button
          type="button"
          role="tab"
          id="tab-classic"
          className="tab"
          aria-selected={tab === 'classic'}
          aria-controls="panel-classic"
          onClick={() => choose('classic')}
        >
          Classic
          <span className="tab__hint">The number, and why</span>
        </button>
        <button
          type="button"
          role="tab"
          id="tab-deep"
          className="tab"
          aria-selected={tab === 'deep'}
          aria-controls="panel-deep"
          onClick={() => choose('deep')}
        >
          2.0 · In depth
          <span className="tab__hint">A proactive, printable report</span>
        </button>
      </div>

      {tab === 'classic' ? (
        <div role="tabpanel" id="panel-classic" aria-labelledby="tab-classic">
          <ClassicView />
        </div>
      ) : (
        <div role="tabpanel" id="panel-deep" aria-labelledby="tab-deep">
          <DeepView />
        </div>
      )}

      <footer className="footer">
        <p>
          <strong>This is not veterinary advice.</strong> Every number here is a population
          average pointed at one animal, and no model can see the dog in front of you. If
          something seems wrong with your dog, ask a vet — not a website.
        </p>
        <p>
          Built on peer-reviewed work: Montoya et al. (2023) for life expectancy by size, Salt
          et al. (2019) for body condition, the Purina Life Span Study for caloric restriction,
          and the AAHA Canine Life Stage Guidelines for the stage boundaries. McMillan et al.
          (2024) is why skull shape and mixed ancestry are deliberately <em>not</em> modelled.
          The sources, the constants and their caveats are all in the repository.
        </p>
        <p>
          <a href={REPO_URL}>Source on GitHub</a> ·{' '}
          <a href={`${REPO_URL}/issues/new`}>Feedback or a correction?</a> · MIT licensed
        </p>
      </footer>
    </div>
  )
}
