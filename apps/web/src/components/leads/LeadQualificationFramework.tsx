import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  User,
  Building,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Target,
  TrendingUp,
  FileText,
  Edit,
  Plus,
  Save,
  X
} from 'lucide-react';

interface QualificationCriteria {
  id: string;
  category: 'budget' | 'authority' | 'need' | 'timeline' | 'fit';
  name: string;
  description: string;
  questions: {
    id: string;
    question: string;
    type: 'boolean' | 'scale' | 'text' | 'select';
    options?: string[];
    weight: number;
    required: boolean;
  }[];
  passingScore: number;
  weight: number;
}

interface QualificationResponse {
  criteriaId: string;
  questionId: string;
  value: string | number | boolean;
  notes?: string;
  timestamp: string;
}

interface LeadQualification {
  leadId: string;
  status: 'not_started' | 'in_progress' | 'qualified' | 'disqualified' | 'on_hold';
  overallScore: number;
  lastUpdated: string;
  responses: QualificationResponse[];
  criteriaScores: {
    [criteriaId: string]: {
      score: number;
      passed: boolean;
      completedQuestions: number;
      totalQuestions: number;
    };
  };
  nextActions: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    dueDate?: string;
    assignedTo?: string;
  }[];
  disqualificationReason?: string;
  qualifiedBy?: string;
  qualifiedAt?: string;
}

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source: string;
  estimatedValue?: number;
  qualification?: LeadQualification;
}

interface LeadQualificationFrameworkProps {
  leads: Lead[];
  criteria: QualificationCriteria[];
  onUpdateQualification: (leadId: string, qualification: Partial<LeadQualification>) => void;
  onUpdateCriteria: (criteria: QualificationCriteria[]) => void;
  readonly?: boolean;
}

// Default BANT+ qualification criteria
const DEFAULT_CRITERIA: QualificationCriteria[] = [
  {
    id: 'budget',
    category: 'budget',
    name: 'Budget Authority',
    description: 'Does the lead have budget allocated for this project?',
    questions: [
      {
        id: 'budget_allocated',
        question: 'Has budget been allocated for this project?',
        type: 'boolean',
        weight: 30,
        required: true
      },
      {
        id: 'budget_range',
        question: 'What is the budget range for this project?',
        type: 'select',
        options: ['Under £10k', '£10k-£25k', '£25k-£50k', '£50k-£100k', 'Over £100k'],
        weight: 25,
        required: true
      },
      {
        id: 'budget_flexibility',
        question: 'How flexible is the budget? (1=very rigid, 5=very flexible)',
        type: 'scale',
        weight: 15,
        required: false
      }
    ],
    passingScore: 50,
    weight: 1.2
  },
  {
    id: 'authority',
    category: 'authority',
    name: 'Decision Authority',
    description: 'Is the lead the decision maker or influencer?',
    questions: [
      {
        id: 'decision_maker',
        question: 'Are you the primary decision maker for this project?',
        type: 'boolean',
        weight: 40,
        required: true
      },
      {
        id: 'influence_level',
        question: 'What is your influence level in the decision? (1=low, 5=high)',
        type: 'scale',
        weight: 30,
        required: true
      },
      {
        id: 'approval_process',
        question: 'Who else is involved in the approval process?',
        type: 'text',
        weight: 20,
        required: false
      }
    ],
    passingScore: 60,
    weight: 1.3
  },
  {
    id: 'need',
    category: 'need',
    name: 'Business Need',
    description: 'Does the lead have a genuine business need?',
    questions: [
      {
        id: 'pain_point',
        question: 'What specific problem are you trying to solve?',
        type: 'text',
        weight: 35,
        required: true
      },
      {
        id: 'urgency',
        question: 'How urgent is this need? (1=not urgent, 5=very urgent)',
        type: 'scale',
        weight: 30,
        required: true
      },
      {
        id: 'consequences',
        question: 'What happens if this problem is not solved?',
        type: 'text',
        weight: 25,
        required: false
      }
    ],
    passingScore: 55,
    weight: 1.4
  },
  {
    id: 'timeline',
    category: 'timeline',
    name: 'Project Timeline',
    description: 'When does the lead want to complete the project?',
    questions: [
      {
        id: 'start_date',
        question: 'When would you like to start the project?',
        type: 'select',
        options: ['Immediately', 'Within 1 month', '1-3 months', '3-6 months', 'Over 6 months'],
        weight: 40,
        required: true
      },
      {
        id: 'completion_date',
        question: 'Do you have a required completion date?',
        type: 'boolean',
        weight: 30,
        required: true
      },
      {
        id: 'flexibility',
        question: 'How flexible are your timelines? (1=rigid, 5=flexible)',
        type: 'scale',
        weight: 20,
        required: false
      }
    ],
    passingScore: 50,
    weight: 1.1
  },
  {
    id: 'fit',
    category: 'fit',
    name: 'Solution Fit',
    description: 'Is there a good fit between their needs and our services?',
    questions: [
      {
        id: 'service_match',
        question: 'Do our services align with your requirements?',
        type: 'scale',
        weight: 35,
        required: true
      },
      {
        id: 'experience_preference',
        question: 'Do you prefer working with experienced specialists?',
        type: 'boolean',
        weight: 25,
        required: true
      },
      {
        id: 'location_preference',
        question: 'Are you comfortable with our service area?',
        type: 'boolean',
        weight: 20,
        required: false
      }
    ],
    passingScore: 60,
    weight: 1.0
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'qualified': return 'text-green-600 bg-green-100 border-green-300';
    case 'disqualified': return 'text-red-600 bg-red-100 border-red-300';
    case 'in_progress': return 'text-blue-600 bg-blue-100 border-blue-300';
    case 'on_hold': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    default: return 'text-gray-600 bg-gray-100 border-gray-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'qualified': return <CheckCircle className="h-4 w-4" />;
    case 'disqualified': return <XCircle className="h-4 w-4" />;
    case 'in_progress': return <Clock className="h-4 w-4" />;
    case 'on_hold': return <AlertTriangle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'budget': return <DollarSign className="h-4 w-4" />;
    case 'authority': return <User className="h-4 w-4" />;
    case 'need': return <Target className="h-4 w-4" />;
    case 'timeline': return <Calendar className="h-4 w-4" />;
    case 'fit': return <Building className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

export function LeadQualificationFramework({ 
  leads, 
  criteria = DEFAULT_CRITERIA, 
  onUpdateQualification, 
  onUpdateCriteria, 
  readonly = false 
}: LeadQualificationFrameworkProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'qualification' | 'criteria'>('overview');
  const [currentCriteria, setCurrentCriteria] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Calculate qualification statistics
  const qualificationStats = leads.reduce(
    (acc, lead) => {
      const status = lead.qualification?.status || 'not_started';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const averageScore = leads
    .filter(lead => lead.qualification?.overallScore)
    .reduce((sum, lead) => sum + (lead.qualification?.overallScore || 0), 0) / 
    (leads.filter(lead => lead.qualification?.overallScore).length || 1);

  const startQualification = (lead: Lead) => {
    setSelectedLead(lead);
    setCurrentCriteria(criteria[0]?.id || null);
    setActiveTab('qualification');
    
    // Load existing responses
    if (lead.qualification?.responses) {
      const responseMap = lead.qualification.responses.reduce((acc, response) => {
        acc[`${response.criteriaId}_${response.questionId}`] = response.value;
        return acc;
      }, {} as Record<string, any>);
      setResponses(responseMap);
    } else {
      setResponses({});
    }
  };

  const saveResponse = (criteriaId: string, questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [`${criteriaId}_${questionId}`]: value
    }));
  };

  const calculateCriteriaScore = (criteriaId: string): number => {
    const criteriaObj = criteria.find(c => c.id === criteriaId);
    if (!criteriaObj) return 0;

    let totalWeight = 0;
    let weightedScore = 0;

    criteriaObj.questions.forEach(question => {
      const responseKey = `${criteriaId}_${question.id}`;
      const response = responses[responseKey];
      
      if (response !== undefined && response !== null && response !== '') {
        totalWeight += question.weight;
        
        let score = 0;
        if (question.type === 'boolean') {
          score = response ? 100 : 0;
        } else if (question.type === 'scale') {
          score = (Number(response) / 5) * 100;
        } else if (question.type === 'select') {
          // Score based on position in options array (higher index = higher score)
          const index = question.options?.indexOf(response) || 0;
          score = ((index + 1) / (question.options?.length || 1)) * 100;
        } else {
          // Text responses get a default score if provided
          score = response.length > 0 ? 70 : 0;
        }
        
        weightedScore += score * question.weight;
      }
    });

    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  };

  const calculateOverallScore = (): number => {
    let totalWeight = 0;
    let weightedScore = 0;

    criteria.forEach(criteriaObj => {
      const score = calculateCriteriaScore(criteriaObj.id);
      if (score > 0) {
        totalWeight += criteriaObj.weight;
        weightedScore += score * criteriaObj.weight;
      }
    });

    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  };

  const saveQualification = () => {
    if (!selectedLead) return;

    const qualificationResponses: QualificationResponse[] = [];
    const criteriaScores: Record<string, any> = {};

    criteria.forEach(criteriaObj => {
      const score = calculateCriteriaScore(criteriaObj.id);
      const completedQuestions = criteriaObj.questions.filter(q => {
        const responseKey = `${criteriaObj.id}_${q.id}`;
        const response = responses[responseKey];
        return response !== undefined && response !== null && response !== '';
      }).length;

      criteriaScores[criteriaObj.id] = {
        score,
        passed: score >= criteriaObj.passingScore,
        completedQuestions,
        totalQuestions: criteriaObj.questions.length
      };

      criteriaObj.questions.forEach(question => {
        const responseKey = `${criteriaObj.id}_${question.id}`;
        const response = responses[responseKey];
        
        if (response !== undefined && response !== null && response !== '') {
          qualificationResponses.push({
            criteriaId: criteriaObj.id,
            questionId: question.id,
            value: response,
            notes: notes[responseKey],
            timestamp: new Date().toISOString()
          });
        }
      });
    });

    const overallScore = calculateOverallScore();
    const allCriteriaPassed = criteria.every(c => criteriaScores[c.id]?.passed);
    const minScore = 60; // Minimum overall score to qualify

    const qualification: Partial<LeadQualification> = {
      status: overallScore >= minScore && allCriteriaPassed ? 'qualified' : 
              overallScore < 30 ? 'disqualified' : 'in_progress',
      overallScore,
      lastUpdated: new Date().toISOString(),
      responses: qualificationResponses,
      criteriaScores,
      nextActions: generateNextActions(criteriaScores, overallScore)
    };

    onUpdateQualification(selectedLead.id, qualification);
    setSelectedLead(null);
    setCurrentCriteria(null);
    setResponses({});
    setNotes({});
  };

  const generateNextActions = (criteriaScores: Record<string, any>, overallScore: number) => {
    const actions: any[] = [];

    // Check for failed criteria
    Object.entries(criteriaScores).forEach(([criteriaId, scoreData]) => {
      if (!scoreData.passed) {
        const criteriaObj = criteria.find(c => c.id === criteriaId);
        actions.push({
          priority: 'high' as const,
          action: `Address ${criteriaObj?.name} concerns`,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week
        });
      }
    });

    // Overall score-based actions
    if (overallScore < 30) {
      actions.push({
        priority: 'low' as const,
        action: 'Consider disqualifying or nurturing for future opportunities'
      });
    } else if (overallScore < 60) {
      actions.push({
        priority: 'medium' as const,
        action: 'Continue qualification process and address gaps'
      });
    } else {
      actions.push({
        priority: 'high' as const,
        action: 'Move to proposal phase'
      });
    }

    return actions;
  };

  const LeadCard = ({ lead }: { lead: Lead }) => {
    const qualification = lead.qualification;
    const status = qualification?.status || 'not_started';
    
    return (
      <div 
        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => startQualification(lead)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</h4>
              <p className="text-sm text-gray-500">{lead.jobTitle} at {lead.company}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
              <span className="ml-1 capitalize">{status.replace('_', ' ')}</span>
            </span>
          </div>
        </div>
        
        {qualification && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overall Score</span>
              <span className="font-medium text-gray-900">{qualification.overallScore.toFixed(1)}/100</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  qualification.overallScore >= 80 ? 'bg-green-500' :
                  qualification.overallScore >= 60 ? 'bg-blue-500' :
                  qualification.overallScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${qualification.overallScore}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{Object.values(qualification.criteriaScores).filter(c => c.passed).length}/{criteria.length} criteria passed</span>
              <span>{new Date(qualification.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        )}
        
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-500">
            <span className="flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span>{lead.email}</span>
            </span>
            {lead.phone && (
              <span className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>{lead.phone}</span>
              </span>
            )}
          </div>
          {lead.estimatedValue && (
            <span className="font-medium text-gray-900">
              £{lead.estimatedValue.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    );
  };

  const QualificationForm = () => {
    if (!selectedLead || !currentCriteria) return null;

    const criteriaObj = criteria.find(c => c.id === currentCriteria);
    if (!criteriaObj) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {getCategoryIcon(criteriaObj.category)}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{criteriaObj.name}</h3>
              <p className="text-sm text-gray-600">{criteriaObj.description}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Current Score</div>
            <div className="text-xl font-bold text-gray-900">
              {calculateCriteriaScore(currentCriteria).toFixed(1)}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {criteriaObj.questions.map((question, index) => {
            const responseKey = `${currentCriteria}_${question.id}`;
            const value = responses[responseKey];

            return (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {index + 1}. {question.question}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </h4>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Weight: {question.weight}
                  </span>
                </div>

                <div className="space-y-3">
                  {question.type === 'boolean' && (
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={responseKey}
                          checked={value === true}
                          onChange={() => saveResponse(currentCriteria, question.id, true)}
                          className="text-blue-600"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={responseKey}
                          checked={value === false}
                          onChange={() => saveResponse(currentCriteria, question.id, false)}
                          className="text-blue-600"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  )}

                  {question.type === 'scale' && (
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">1</span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={value || 3}
                        onChange={(e) => saveResponse(currentCriteria, question.id, parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500">5</span>
                      <span className="text-sm font-medium text-gray-900 w-8">{value || 3}</span>
                    </div>
                  )}

                  {question.type === 'select' && (
                    <select
                      value={value || ''}
                      onChange={(e) => saveResponse(currentCriteria, question.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select an option...</option>
                      {question.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}

                  {question.type === 'text' && (
                    <textarea
                      value={value || ''}
                      onChange={(e) => saveResponse(currentCriteria, question.id, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your response..."
                    />
                  )}

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Notes (optional)</label>
                    <input
                      type="text"
                      value={notes[responseKey] || ''}
                      onChange={(e) => setNotes(prev => ({ ...prev, [responseKey]: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add notes about this response..."
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <div className="flex space-x-2">
            {criteria.map((c, index) => (
              <button
                key={c.id}
                onClick={() => setCurrentCriteria(c.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentCriteria === c.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setSelectedLead(null)}>
              Cancel
            </Button>
            <Button onClick={saveQualification}>
              <Save className="h-4 w-4 mr-2" />
              Save Qualification
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Lead Qualification</h3>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {leads.length} leads
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-gray-900">Average Score</h4>
          </div>
          <div className="text-2xl font-bold text-gray-900">{averageScore.toFixed(1)}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-gray-900">Qualified</h4>
          </div>
          <div className="text-2xl font-bold text-green-600">{qualificationStats.qualified || 0}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-gray-900">In Progress</h4>
          </div>
          <div className="text-2xl font-bold text-blue-600">{qualificationStats.in_progress || 0}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <h4 className="font-medium text-gray-900">Disqualified</h4>
          </div>
          <div className="text-2xl font-bold text-red-600">{qualificationStats.disqualified || 0}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-gray-600" />
            <h4 className="font-medium text-gray-900">Not Started</h4>
          </div>
          <div className="text-2xl font-bold text-gray-600">{qualificationStats.not_started || 0}</div>
        </div>
      </div>

      {/* Content */}
      {selectedLead ? (
        <QualificationForm />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads
            .sort((a, b) => {
              // Sort by qualification status and score
              const aScore = a.qualification?.overallScore || 0;
              const bScore = b.qualification?.overallScore || 0;
              const aStatus = a.qualification?.status || 'not_started';
              const bStatus = b.qualification?.status || 'not_started';
              
              if (aStatus !== bStatus) {
                const statusOrder = { qualified: 0, in_progress: 1, not_started: 2, on_hold: 3, disqualified: 4 };
                return statusOrder[aStatus] - statusOrder[bStatus];
              }
              
              return bScore - aScore;
            })
            .map(lead => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
        </div>
      )}
    </div>
  );
}