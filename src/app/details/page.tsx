import { parse } from 'node-html-parser';

interface PageProps {
  searchParams: Promise<{ 
    ref: string;
    idcompt: string;
    m_a_j: string;
  }> | { 
    ref: string;
    idcompt: string;
    m_a_j: string;
  };
}

export default async function Details({ searchParams }: PageProps) {
  const params = await searchParams;
  console.log('params', params);
  const response = await fetch(
    `https://www.steg.com.tn/fr/espace/${params.ref}&idcompt=${params.idcompt}&m_a_j=${params.m_a_j}`,
    {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    }
  );

  const html = await response.text();
  
  const doc = parse(html);

  // Extract the required information with more precise selectors
  const montant = doc.querySelector('td[width="91"] div[align="center"] span.soustitrebleuclair b')?.textContent?.replace(/\s+/g, '') || 'aaaa0';
  const montantTTC = doc.querySelector('td[width="207"] span[style="font-size:12px"] b')?.textContent?.trim() || '';
  
  // Get all elements with class texte4 that contain a <b> tag
  const dateElements = doc.querySelectorAll('span.texte4 b');
  const datePaiement = dateElements[0]?.textContent?.trim() || '';
  const dateLecture = dateElements[1]?.textContent?.trim() || '';

  console.log('montant', montant, 'montantTTC', montantTTC, 'datePaiement', datePaiement, 'dateLecture', dateLecture);

  return (
    <div className="p-4 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex gap-4">
        <div className="w-[200px] bg-white">
          <div className="border border-red-500">
            <div className="bg-[#D8ECF5] p-4">
              <div className="text-3xl font-bold text-center mb-2">{montant}</div>
              <div className="text-red-500 text-center">
                <div className="text-xs">(19)المبلغ المطلوب</div>
                <div className="text-sm">Montant à payer</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[150px] bg-white">
          <div className="border border-[#97CCE6]">
            <div className="bg-[#D8ECF5] p-4">
              <div className="text-center text-sm font-bold">
                {montantTTC}
              </div>
            </div>
          </div>
        </div>

        <div className="w-[150px] bg-white">
          <div className="border border-red-500">
            <div className="bg-[#D8ECF5] p-4">
              <div className="text-center">
                <div className="text-xs mb-2">الرجاء الدفع قبل</div>
                <div className="font-bold">{datePaiement}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[150px] bg-white">
          <div className="border border-[#97CCE6]">
            <div className="bg-[#D8ECF5] p-4">
              <div className="text-center">
                <div className="text-xs mb-2">التاريخ المقبل لقراءة العداد</div>
                <div className="font-bold">{dateLecture}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}