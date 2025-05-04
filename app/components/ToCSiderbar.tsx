export const TocSidebar = ({ toc }) => {
 return (
  <nav className="toc-sidebar">
   <ul>
    {toc.map((item) => (
     <li key={item.id} style={{ marginLeft: (item.level - 1) * 16 }}>
      <a href={`#${item.id}`}>{item.text}</a>
     </li>
    ))}
   </ul>
  </nav>
 )
}
