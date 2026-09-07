function FlightStripStatusField({
                                    title,
                                    count = 0,
                                    mode = 'MAIN',
                                    isActive = false,
                                    warningCount = 0,
                                }) {
    return (
        <header className={`status-field ${isActive ? 'status-field--active' : ''}`}>
            <div className="status-field__left">
                <span className="status-field__mode">{mode}</span>
                <span className="status-field__title">{title}</span>
            </div>

            <div className="status-field__right">
                {warningCount > 0 && (
                    <span className="status-field__warning">
            {warningCount} WARN
          </span>
                )}
                <span className="status-field__count">{count}</span>
            </div>
        </header>
    )
}

export default FlightStripStatusField