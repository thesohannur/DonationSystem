// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format datetime
export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate days remaining
export const getDaysRemaining = (expirationDate) => {
  const now = new Date();
  const expiry = new Date(expirationDate);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Calculate campaign progress percentage
export const calculateProgress = (current, goal) => {
  if (!goal || goal === 0) return 0;
  return Math.min((current / goal) * 100, 100);
};

// Get status badge class
export const getStatusClass = (status) => {
  const statusMap = {
    SUCCESS: 'status-success',
    PENDING: 'status-pending',
    FAILED: 'status-failed',
    APPROVED: 'status-approved',
    REJECTED: 'status-rejected',
    COMPLETED: 'status-completed',
  };
  return statusMap[status] || 'status-default';
};