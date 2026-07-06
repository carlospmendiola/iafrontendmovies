import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Card from './Card'

const mockMovie = { _id: '1', title: 'Inception', poster: 'poster.jpg', year: 2010 }

describe('Card', () => {
  it('renders movie title', () => {
    render(<Card movie={mockMovie} />)
    expect(screen.getByText('Inception')).toBeInTheDocument()
  })

  it('renders movie poster with alt text', () => {
    render(<Card movie={mockMovie} />)
    expect(screen.getByRole('img', { name: /inception/i })).toBeInTheDocument()
  })

  it('renders with BEM block class "card"', () => {
    const { container } = render(<Card movie={mockMovie} />)
    expect(container.firstChild).toHaveClass('card')
  })
})
