function SkillTag({ skill, onRemove, removable = false }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
      {skill}
      {removable && (
        <button
          onClick={() => onRemove(skill)}
          className="text-gray-400 hover:text-red-500 leading-none"
          type="button"
        >
          ×
        </button>
      )}
    </span>
  )
}

export default SkillTag