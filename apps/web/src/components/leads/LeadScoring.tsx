import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  TrendingUp, 
  TrendingDown,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Award,
  Activity,
  Settings,
  Info,
  Eye,
  Edit
} from 'lucide-react';

interface LeadScoringRule {
  id: string;
  category: 'demographic' | 'behavioral' | 'engagement' | 'firmographic' | 'explicit';
  name: string;
  description: string;
  field: string;
  condition: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists';
  value?: string | number;
  points: number;
  weight: number;
  active: boolean;
}

interface LeadScore {
  leadId: string;
  totalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  lastUpdated: string;
  breakdown: {
    demographic: number;
    behavioral: number;
    engagement: number;
    firmographic: number;
    explicit: number;
  };
  appliedRules: {
    ruleId: string;
    ruleName: string;
    points: number;
    matchedValue?: string;
  }[];
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    reason: string;
  }[];
}

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  employees?: number;
  revenue?: number;
  source: string;
  status: string;
  lastActivity?: string;
  score?: LeadScore;
  metadata: Record<string, any>;
}

interface LeadScoringProps {
  leads: Lead[];
  rules: LeadScoringRule[];
  onUpdateRules: (rules: LeadScoringRule[]) => void;
  onRecalculateScores: () => void;
  readonly?: boolean;
}

const DEFAULT_SCORING_RULES: LeadScoringRule[] = [
  // Demographic Rules
  {
    id: 'demo_job_title_decision_maker',
    category: 'demographic',
    name: 'Decision Maker Job Title',
    description: 'Lead has a decision-making job title',
    field: 'jobTitle',
    condition: 'contains',
    value: 'CEO|CTO|Director|Manager|Owner|President',
    points: 20,
    weight: 1.0,
    active: true
  },
  {
    id: 'demo_company_size_ideal',
    category: 'demographic',
    name: 'Ideal Company Size',
    description: 'Company has optimal employee count',
    field: 'employees',
    condition: 'greater_than',
    value: 10,
    points: 15,
    weight: 1.0,
    active: true
  },
  
  // Firmographic Rules
  {
    id: 'firmo_industry_target',
    category: 'firmographic',
    name: 'Target Industry',
    description: 'Lead is in target industry',
    field: 'industry',
    condition: 'equals',
    value: 'Construction & Building|Real Estate|Architecture & Design',
    points: 25,
    weight: 1.2,
    active: true
  },
  {
    id: 'firmo_revenue_qualification',
    category: 'firmographic',
    name: 'Revenue Qualification',
    description: 'Company revenue meets minimum threshold',
    field: 'revenue',
    condition: 'greater_than',
    value: 100000,
    points: 15,
    weight: 1.0,
    active: true
  },
  
  // Behavioral Rules
  {
    id: 'behavior_email_provided',
    category: 'behavioral',
    name: 'Contact Information',
    description: 'Lead provided email address',
    field: 'email',
    condition: 'exists',
    points: 10,
    weight: 1.0,
    active: true
  },
  {
    id: 'behavior_phone_provided',
    category: 'behavioral',
    name: 'Phone Number Provided',
    description: 'Lead provided phone number',
    field: 'phone',
    condition: 'exists',
    points: 15,
    weight: 1.0,
    active: true
  },
  
  // Engagement Rules
  {
    id: 'engage_recent_activity',
    category: 'engagement',
    name: 'Recent Activity',
    description: 'Lead had recent activity',
    field: 'lastActivity',
    condition: 'exists',
    points: 10,
    weight: 1.1,
    active: true
  },
  {
    id: 'engage_direct_source',
    category: 'engagement',
    name: 'High-Intent Source',
    description: 'Lead came from high-intent source',
    field: 'source',
    condition: 'equals',
    value: 'Direct|Referral|Phone',
    points: 20,
    weight: 1.3,
    active: true
  },
  
  // Explicit Rules
  {
    id: 'explicit_project_timeline',
    category: 'explicit',
    name: 'Project Timeline',
    description: 'Lead has immediate project timeline',
    field: 'metadata.timeline',
    condition: 'equals',
    value: 'immediate|within_month',
    points: 30,
    weight: 1.5,
    active: true
  },
  {
    id: 'explicit_budget_confirmed',
    category: 'explicit',
    name: 'Budget Confirmed',
    description: 'Lead has confirmed budget',
    field: 'metadata.budget',
    condition: 'exists',
    points: 25,
    weight: 1.4,
    active: true
  }
];

const getScoreGrade = (score: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  if (score >= 35) return 'D';
  return 'F';
};

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A': return 'text-green-600 bg-green-100 border-green-300';
    case 'B': return 'text-blue-600 bg-blue-100 border-blue-300';
    case 'C': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    case 'D': return 'text-orange-600 bg-orange-100 border-orange-300';
    case 'F': return 'text-red-600 bg-red-100 border-red-300';
    default: return 'text-gray-600 bg-gray-100 border-gray-300';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'demographic': return <User className="h-4 w-4" />;
    case 'firmographic': return <Building className="h-4 w-4" />;
    case 'behavioral': return <Activity className="h-4 w-4" />;
    case 'engagement': return <Target className="h-4 w-4" />;
    case 'explicit': return <Star className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};

export function LeadScoring({ leads, rules = DEFAULT_SCORING_RULES, onUpdateRules, onRecalculateScores, readonly = false }: LeadScoringProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'analysis'>('overview');
  const [showRuleEditor, setShowRuleEditor] = useState(false);
  const [editingRule, setEditingRule] = useState<LeadScoringRule | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Calculate scores for all leads (mock implementation)
  const calculateLeadScore = (lead: Lead): LeadScore => {
    const breakdown = {
      demographic: 0,
      behavioral: 0,
      engagement: 0,
      firmographic: 0,
      explicit: 0
    };
    
    const appliedRules: LeadScore['appliedRules'] = [];
    
    rules.filter(rule => rule.active).forEach(rule => {
      let matches = false;
      let matchedValue: string | undefined;
      
      // Get field value from lead
      const fieldValue = rule.field.includes('.') 
        ? rule.field.split('.').reduce((obj, key) => obj?.[key], lead as any)
        : (lead as any)[rule.field];
      
      // Check condition
      switch (rule.condition) {
        case 'exists':
          matches = fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
          break;
        case 'not_exists':
          matches = fieldValue === undefined || fieldValue === null || fieldValue === '';
          break;
        case 'equals':
          matches = rule.value?.toString().split('|').some(val => 
            fieldValue?.toString().toLowerCase() === val.toLowerCase()
          ) || false;
          break;
        case 'contains':
          matches = rule.value?.toString().split('|').some(val => 
            fieldValue?.toString().toLowerCase().includes(val.toLowerCase())
          ) || false;
          break;
        case 'greater_than':
          matches = Number(fieldValue) > Number(rule.value);
          break;
        case 'less_than':
          matches = Number(fieldValue) < Number(rule.value);
          break;
      }
      
      if (matches) {
        const points = Math.round(rule.points * rule.weight);
        breakdown[rule.category] += points;
        appliedRules.push({
          ruleId: rule.id,
          ruleName: rule.name,
          points,
          matchedValue: fieldValue?.toString()
        });
      }
    });
    
    const totalScore = Math.min(100, Object.values(breakdown).reduce((sum, val) => sum + val, 0));
    const grade = getScoreGrade(totalScore);
    
    // Generate recommendations based on score and missing criteria
    const recommendations: LeadScore['recommendations'] = [];
    
    if (totalScore < 50) {
      recommendations.push({
        priority: 'high',
        action: 'Qualify lead further',
        reason: 'Low overall score indicates need for more information'
      });
    }
    
    if (breakdown.firmographic < 20) {
      recommendations.push({
        priority: 'medium',
        action: 'Research company details',
        reason: 'Limited firmographic data affecting score'
      });
    }
    
    if (breakdown.engagement < 15) {
      recommendations.push({
        priority: 'high',
        action: 'Increase engagement activities',
        reason: 'Low engagement score indicates limited interaction'
      });
    }
    
    return {
      leadId: lead.id,
      totalScore,
      grade,
      lastUpdated: new Date().toISOString(),
      breakdown,
      appliedRules,
      recommendations
    };
  };

  const leadsWithScores = leads.map(lead => ({
    ...lead,
    score: calculateLeadScore(lead)
  }));

  const scoreDistribution = leadsWithScores.reduce((acc, lead) => {
    const grade = lead.score!.grade;
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const averageScore = leadsWithScores.reduce((sum, lead) => sum + lead.score!.totalScore, 0) / leadsWithScores.length || 0;

  const ScoreCard = ({ lead }: { lead: Lead & { score: LeadScore } }) => (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedLead(lead)}
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
          <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getGradeColor(lead.score.grade)}`}>
            {lead.score.grade}
          </span>
          <span className="text-lg font-semibold text-gray-900">
            {lead.score.totalScore}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-2 mb-3">
        {Object.entries(lead.score.breakdown).map(([category, score]) => (
          <div key={category} className="text-center">
            <div className="text-sm font-medium text-gray-900">{score}</div>
            <div className="text-xs text-gray-500 capitalize">{category.slice(0, 4)}</div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className="flex items-center space-x-1">
          <Activity className="h-3 w-3" />
          <span>{lead.score.appliedRules.length} rules applied</span>
        </span>
        <span className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>{new Date(lead.score.lastUpdated).toLocaleDateString()}</span>
        </span>
      </div>
    </div>
  );

  const RuleEditor = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h4 className="font-semibold text-gray-900 mb-4">Scoring Rules</h4>
      
      <div className="space-y-4">
        {Object.entries(
          rules.reduce((acc, rule) => {
            acc[rule.category] = acc[rule.category] || [];
            acc[rule.category].push(rule);
            return acc;
          }, {} as Record<string, LeadScoringRule[]>)
        ).map(([category, categoryRules]) => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              {getCategoryIcon(category)}
              <h5 className="font-medium text-gray-900 capitalize">{category}</h5>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {categoryRules.length} rules
              </span>
            </div>
            
            <div className="space-y-2">
              {categoryRules.map(rule => (
                <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h6 className="font-medium text-gray-900">{rule.name}</h6>
                      <span className="text-sm text-gray-500">+{rule.points} pts</span>
                      {rule.weight !== 1.0 && (
                        <span className="text-xs text-blue-600">×{rule.weight}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateRules(rules.map(r => 
                        r.id === rule.id ? { ...r, active: !r.active } : r
                      ))}
                      className={`p-1 rounded ${
                        rule.active ? 'text-green-600 bg-green-100' : 'text-gray-400 bg-gray-100'
                      }`}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    
                    {!readonly && (
                      <button
                        onClick={() => setEditingRule(rule)}
                        className="p-1 text-gray-600 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Lead Scoring</h3>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {leads.length} leads
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onRecalculateScores}>
            <Activity className="h-4 w-4 mr-2" />
            Recalculate
          </Button>
          {!readonly && (
            <Button onClick={() => setShowRuleEditor(!showRuleEditor)}>
              <Settings className="h-4 w-4 mr-2" />
              {showRuleEditor ? 'Hide Rules' : 'Manage Rules'}
            </Button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-gray-900">Average Score</h4>
          </div>
          <div className="text-2xl font-bold text-gray-900">{averageScore.toFixed(1)}</div>
          <div className="text-sm text-gray-500">Out of 100</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-gray-900">A Grade Leads</h4>
          </div>
          <div className="text-2xl font-bold text-green-600">{scoreDistribution.A || 0}</div>
          <div className="text-sm text-gray-500">High priority</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <h4 className="font-medium text-gray-900">B-C Grade Leads</h4>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{(scoreDistribution.B || 0) + (scoreDistribution.C || 0)}</div>
          <div className="text-sm text-gray-500">Medium priority</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h4 className="font-medium text-gray-900">D-F Grade Leads</h4>
          </div>
          <div className="text-2xl font-bold text-red-600">{(scoreDistribution.D || 0) + (scoreDistribution.F || 0)}</div>
          <div className="text-sm text-gray-500">Low priority</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Lead Scores' },
            { id: 'rules', label: 'Scoring Rules' },
            { id: 'analysis', label: 'Analysis' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leadsWithScores
            .sort((a, b) => b.score!.totalScore - a.score!.totalScore)
            .map(lead => (
              <ScoreCard key={lead.id} lead={lead} />
            ))}
        </div>
      )}

      {activeTab === 'rules' && <RuleEditor />}

      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Score Distribution</h4>
            <div className="space-y-3">
              {Object.entries(scoreDistribution).map(([grade, count]) => (
                <div key={grade} className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getGradeColor(grade)}`}>
                    Grade {grade}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                      <div 
                        className={`h-2 rounded-full ${getGradeColor(grade).split(' ')[1]}`}
                        style={{ width: `${(count / leads.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Top Performing Rules</h4>
            <div className="space-y-3">
              {rules
                .filter(rule => rule.active)
                .sort((a, b) => (b.points * b.weight) - (a.points * a.weight))
                .slice(0, 5)
                .map(rule => (
                  <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(rule.category)}
                      <span className="font-medium text-gray-900">{rule.name}</span>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      +{Math.round(rule.points * rule.weight)} pts
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && selectedLead.score && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedLead.firstName} {selectedLead.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedLead.jobTitle} at {selectedLead.company}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-4 py-2 rounded-full text-lg font-bold border-2 ${getGradeColor(selectedLead.score.grade)}`}>
                    Grade {selectedLead.score.grade}
                  </span>
                  <span className="text-2xl font-bold text-gray-900">{selectedLead.score.totalScore}</span>
                  <button 
                    onClick={() => setSelectedLead(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Score Breakdown</h4>
                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(selectedLead.score.breakdown).map(([category, score]) => (
                    <div key={category} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{score}</div>
                      <div className="text-xs text-gray-500 capitalize">{category}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Applied Rules ({selectedLead.score.appliedRules.length})</h4>
                <div className="space-y-2">
                  {selectedLead.score.appliedRules.map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-sm text-gray-900">{rule.ruleName}</span>
                      <span className="text-sm font-medium text-green-600">+{rule.points}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedLead.score.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                  <div className="space-y-2">
                    {selectedLead.score.recommendations.map((rec, index) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${
                        rec.priority === 'high' ? 'border-red-400 bg-red-50' :
                        rec.priority === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                        'border-blue-400 bg-blue-50'
                      }`}>
                        <div className="font-medium text-gray-900">{rec.action}</div>
                        <div className="text-sm text-gray-600">{rec.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}