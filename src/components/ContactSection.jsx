function ContactSection({ contact }) {
  return (
    <section id="contact" className="card contact-card reveal-section">
      <h2 className="section-title">Contact Info</h2>
      {contact.phone && <p>Phone: {contact.phone}</p>}
      <div className="contact-links-row">
        {contact.email && (
          <p>
            <a href={`mailto:${contact.email}`} target="_blank" rel="noreferrer">
              Email
            </a>
          </p>
        )}
        {contact.linkedin && (
          <p>
            <a href={contact.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </p>
        )}
      </div>
      {contact.github && (
        <p>
          GitHub:{' '}
          <a href={contact.github} target="_blank" rel="noreferrer">
            {contact.github}
          </a>
        </p>
      )}
    </section>
  )
}

export default ContactSection
