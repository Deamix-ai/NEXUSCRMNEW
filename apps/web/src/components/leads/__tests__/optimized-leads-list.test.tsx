import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithProviders, createMockLead, mockFetch } from '@/test/test-utils'
import { OptimizedLeadsList } from '@/components/leads/optimized-leads-list'

describe('OptimizedLeadsList', () => {
  const mockLeads = [
    createMockLead({
      id: '1',
      title: 'Test Lead 1',
      status: 'NEW',
      priority: 'HIGH',
      clientName: 'John Doe',
      estimatedValue: 5000,
    }),
    createMockLead({
      id: '2',
      title: 'Test Lead 2',
      status: 'CONTACTED',
      priority: 'MEDIUM',
      clientName: 'Jane Smith',
      estimatedValue: 3000,
    }),
  ]

  const mockOnConvert = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders leads list correctly', () => {
    const { getByText, getByRole } = renderWithProviders(
      <OptimizedLeadsList
        leads={mockLeads}
        onConvert={mockOnConvert}
        loading={false}
      />
    )

    expect(getByText('Test Lead 1')).toBeInTheDocument()
    expect(getByText('Test Lead 2')).toBeInTheDocument()
    expect(getByText('John Doe')).toBeInTheDocument()
    expect(getByText('Jane Smith')).toBeInTheDocument()
  })

  it('displays loading state', () => {
    const { container } = renderWithProviders(
      <OptimizedLeadsList
        leads={[]}
        onConvert={mockOnConvert}
        loading={true}
      />
    )

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('displays empty state when no leads', () => {
    const { getByText } = renderWithProviders(
      <OptimizedLeadsList
        leads={[]}
        onConvert={mockOnConvert}
        loading={false}
      />
    )

    expect(getByText('No leads found')).toBeInTheDocument()
  })

  it('filters leads by search term', () => {
    const { getByText, queryByText } = renderWithProviders(
      <OptimizedLeadsList
        leads={mockLeads}
        onConvert={mockOnConvert}
        searchTerm="John"
        loading={false}
      />
    )

    expect(getByText('Test Lead 1')).toBeInTheDocument()
    expect(queryByText('Test Lead 2')).not.toBeInTheDocument()
  })

  it('sorts leads by priority', () => {
    const highPriorityLead = createMockLead({
      id: '3',
      title: 'High Priority Lead',
      priority: 'URGENT',
      createdAt: new Date('2023-01-01').toISOString(),
    })

    const lowPriorityLead = createMockLead({
      id: '4',
      title: 'Low Priority Lead',
      priority: 'LOW',
      createdAt: new Date('2023-01-02').toISOString(),
    })

    const { container } = renderWithProviders(
      <OptimizedLeadsList
        leads={[lowPriorityLead, highPriorityLead]}
        onConvert={mockOnConvert}
        loading={false}
      />
    )

    const rows = container.querySelectorAll('tbody tr')
    expect(rows[0]).toHaveTextContent('High Priority Lead')
    expect(rows[1]).toHaveTextContent('Low Priority Lead')
  })

  it('handles convert action', async () => {
    const { getByText } = renderWithProviders(
      <OptimizedLeadsList
        leads={mockLeads}
        onConvert={mockOnConvert}
        loading={false}
      />
    )

    const convertButtons = getByText('Convert')
    convertButtons.click()

    expect(mockOnConvert).toHaveBeenCalledWith(mockLeads[0])
  })

  it('displays correct status colors', () => {
    const { container } = renderWithProviders(
      <OptimizedLeadsList
        leads={mockLeads}
        onConvert={mockOnConvert}
        loading={false}
      />
    )

    const newStatusBadge = container.querySelector('.bg-blue-100')
    const contactedStatusBadge = container.querySelector('.bg-yellow-100')

    expect(newStatusBadge).toBeInTheDocument()
    expect(contactedStatusBadge).toBeInTheDocument()
  })

  it('formats currency correctly', () => {
    const { getByText } = renderWithProviders(
      <OptimizedLeadsList
        leads={mockLeads}
        onConvert={mockOnConvert}
        loading={false}
      />
    )

    expect(getByText('£5,000.00')).toBeInTheDocument()
    expect(getByText('£3,000.00')).toBeInTheDocument()
  })

  it('formats dates correctly', () => {
    const testDate = new Date('2023-12-01T10:30:00Z')
    const leadWithDate = createMockLead({
      id: '5',
      title: 'Date Test Lead',
      createdAt: testDate.toISOString(),
    })

    const { getByText } = renderWithProviders(
      <OptimizedLeadsList
        leads={[leadWithDate]}
        onConvert={mockOnConvert}
        loading={false}
      />
    )

    expect(getByText('1 Dec 2023')).toBeInTheDocument()
  })

  it('has accessible table structure', () => {
    const { getByRole } = renderWithProviders(
      <OptimizedLeadsList
        leads={mockLeads}
        onConvert={mockOnConvert}
        loading={false}
      />
    )

    const table = getByRole('table')
    expect(table).toBeInTheDocument()
    expect(table).toHaveAccessibleName() // Implicit via proper table structure
  })
})