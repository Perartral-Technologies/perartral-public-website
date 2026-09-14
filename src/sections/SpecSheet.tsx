import { anvik, deliverables, contact } from '../data/site'

/** Print-only one-page Anvik spec sheet. Hidden on screen; shown by window.print(). */
export function SpecSheet() {
  return (
    <div id="spec-sheet">
      <div className="ss-head">
        <div>
          <div className="ss-brand">
            PERARTRAL<span>·</span>DEFENCE
          </div>
          <h1>Anvik · Portable ISR Quadcopter</h1>
          <p>Portable ISR quadcopter carrying Perartral’s AI analytics for property intelligence.</p>
        </div>
        <div className="ss-tag">Spec sheet</div>
      </div>

      <div className="ss-cols">
        <section>
          <h2>Platform specification</h2>
          <table>
            <tbody>
              {anvik.specs.map((s) => (
                <tr key={s.label}>
                  <th>{s.label}</th>
                  <td>
                    {s.value} {s.unit}
                  </td>
                </tr>
              ))}
              {anvik.secondary.map((s) => (
                <tr key={s.label}>
                  <th>{s.label}</th>
                  <td>{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>Design</h2>
          <ul>
            {anvik.traits.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <h2>Deliverables to CEPI / CRPF</h2>
          <ul>
            {deliverables.items.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="ss-foot">
        <span>
          {contact.name} · {contact.roleLine}
        </span>
        <span>
          {contact.email} · {contact.phone} · {contact.address}
        </span>
        <span>
          Figures from Perartral Technologies’ Defence Vertical concept note. Manufactured by Amber Wings Pvt. Ltd. to
          Perartral specification.
        </span>
      </div>
    </div>
  )
}
