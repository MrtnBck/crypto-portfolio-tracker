/* 
✅ List of coins added by the user
✅ Input field to edit the amount owned
✅ Show total value for each coin
✅ Remove button
*/

export default function Portfolio({ items }) {
  console.log(items);

  return (
    <>
      <h3>Balances ({items.length})</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}></li>
        ))}
      </ul>

      {/*       <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Allocation</th>
            <th>Amount</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table> */}
    </>
  );
}
