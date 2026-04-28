import Mail from './icons/Mail'
import Linkedin from './icons/Linkedin'

function ContactSection({ contact }) {
  return (
    <section id="contact" className="card contact-card reveal-section">
      <h2 className="section-title">Contact Info</h2>
      {contact.phone && <p>Phone: {contact.phone}</p>}
      <div className="contact-links-row">
        {contact.email && (
          <a href={`mailto:${contact.email}`} target="_blank" rel="noreferrer" className="icon-link" title="Email">
            <Mail size={24} />
          </a>
        )}
        {contact.linkedin && (
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="icon-link" title="LinkedIn">
            <Linkedin size={24} />
          </a>
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
