function StatusBadge({ status }) {
  const styles = {
    applied: 'bg-blue-50 text-blue-700 border-blue-200',
    shortlisted: 'bg-amber-50 text-amber-700 border-amber-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    hired: 'bg-green-50 text-green-700 border-green-200',
  }

  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${styles[status] || styles.applied}`}>
      {status}
    </span>
  )
}

export default StatusBadge