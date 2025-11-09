import React from 'react'
import { Link } from 'react-router-dom'

function CardClassifica({link}) {
  return (
  <div className="card w-90 bg-base-200 card-xl shadow-sm">
  <div className="card-body p-5">
    <h2 className="card-title">Serie A</h2>
    <div className="overflow-x-auto">
  <table className="table table-sm">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Player</th>
        <th>Punti</th>
        <th>Forma</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      <tr>
        <th>1</th>
        <td>Cy Ganderton</td>
        <td>Quality Control Specialist</td>
        <td>Blue</td>
      </tr>
      {/* row 2 */}
      <tr>
        <th>2</th>
        <td>Hart Hagerty</td>
        <td>Desktop Support Technician</td>
        <td>Purple</td>
      </tr>
      {/* row 3 */}
      <tr>
        <th>3</th>
        <td>Brice Swyre</td>
        <td>Tax Accountant</td>
        <td>Red</td>
      </tr>
    </tbody>
  </table>
</div>
    <div className="justify-end card-actions">
      <Link to={link} className="text-sm text-blue-400">Vai...</Link>
    </div>
  </div>
</div>
  )
}

export default CardClassifica