import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function DataTable({ columns, data, actions, searchKeys = [] }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search && searchKeys.length) {
      const q = search.toLowerCase();
      rows = rows.filter(r => searchKeys.some(k => String(r[k] ?? '').toLowerCase().includes(q)));
    }
    if (sortKey) {
      rows.sort((a, b) => {
        const av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
        return sortDir === 'asc' ? String(av).localeCompare(String(bv), undefined, { numeric: true })
          : String(bv).localeCompare(String(av), undefined, { numeric: true });
      });
    }
    return rows;
  }, [data, search, sortKey, sortDir, searchKeys]);

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  return (
    <div>
      {searchKeys.length > 0 && (
        <div className="table-controls">
          <input className="search-input" placeholder="Cari data..." value={search}
            onChange={e => setSearch(e.target.value)} />
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{filtered.length} data ditemukan</span>
        </div>
      )}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: 40 }}>No</th>
              {columns.map(col => (
                <th key={col.key} onClick={() => col.sortable !== false && handleSort(col.key)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {sortKey === col.key && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </span>
                </th>
              ))}
              {actions && <th>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={columns.length + (actions ? 2 : 1)} className="no-data">Tidak ada data</td></tr>
            ) : filtered.map((row, i) => (
              <tr key={row.id ?? i}>
                <td>{i + 1}</td>
                {columns.map(col => (
                  <td key={col.key}>{col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}</td>
                ))}
                {actions && <td><div className="table-actions">{actions(row)}</div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
