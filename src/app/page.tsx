import { parse } from 'node-html-parser';
import { redirect } from 'next/navigation';

async function submitForm(formData: FormData) {
  'use server';
  
  formData.append('submit', 'Entrer');
  
  const response = await fetch('https://www.steg.com.tn/fr/espace/login.php', {
    method: 'POST',
    body: formData,
  });

  const html = await response.text();
  
  // Parse the HTML string
  const doc = parse(html);
  
  // Extract references
  const references = [];
  const rows = doc.querySelectorAll('#references tr');
  
  for (const row of rows) {
    const nameCell = row.querySelector('td:nth-child(3)');
    const consultLink = row.querySelector('a[title="Consulter/Payer"]');
    
    if (nameCell && consultLink) {
      references.push({
        name: nameCell.textContent?.trim(),
        href: consultLink.getAttribute('href')
      });
    }
  }

  // Get details for first reference
  if (references.length > 0 && references[2].href) {
    console.log('references', references);
    redirect(`/details?ref=${references[2].href}`);
  }
}

export default function Home() {
  return (
    <div className="p-4">
      <form action={submitForm}>
        <div className="mb-4">
          <label htmlFor="utilisateur" className="block mb-2">Username:</label>
          <input
            type="text"
            name="utilisateur"
            id="utilisateur"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="pwd" className="block mb-2">Password:</label>
          <input
            type="password"
            name="pwd"
            id="pwd"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
