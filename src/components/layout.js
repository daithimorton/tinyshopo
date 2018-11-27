import React from 'react'
import Helmet from 'react-helmet'
import './layout.css'

const Header = () => (
  <header>
    <h1 className="site-title">Tiny Shopo</h1>
  </header>
)

const Layout = ({ children }) => (
  <div className="app">
    <Helmet
      title="Tiny Shopo | A Tiny Shopo for tiny things"
      meta={[{ name: 'description', content: 'Tiny Shopo' }]}
    />
    <Header />
    <main>{children}</main>
    <footer>
      <a
        href="https://twitter.com/Beautifwhale"
        target="_blank"
        rel="noopener noreferrer"
      >
        @Beautifwhale
      </a>
    </footer>
  </div>
)

export default Layout
