
import { render, screen, waitFor } from '@testing-library/react'
import Home from '../pages/index'
import '@testing-library/jest-dom'

// Mock axios to avoid real API calls
jest.mock('axios', () => ({
    get: jest.fn((url) => {
        if (url.includes('/health')) {
            return Promise.resolve({ data: { status: 'healthy' } })
        }
        if (url.includes('/message')) {
            return Promise.resolve({ data: { message: 'Hello from Backend!' } })
        }
        return Promise.reject(new Error('not found'))
    }),
}))

describe('Home Page', () => {
    it('renders the main heading', () => {
        render(<Home />)
        const heading = screen.getByRole('heading', {
            name: /DevOps Assignment/i,
            level: 1,
        })
        expect(heading).toBeInTheDocument()
    })

    it('initially shows loading state', () => {
        render(<Home />)
        // Check for "Loading..." text which is the initial state of message
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
})
