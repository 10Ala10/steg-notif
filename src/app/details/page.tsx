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
    <div className="p-8 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-5xl">
        {/* Amount to Pay Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-t-4 border-red-500">
            <div className="p-6">
              <div className="text-4xl font-bold text-center text-gray-800 mb-3">
                {montant}
              </div>
              <div className="text-red-500 text-center">
                <div className="text-sm font-medium mb-1">(19)المبلغ المطلوب</div>
                <div className="text-base">Montant à payer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Amount Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-t-4 border-blue-400">
            <div className="p-6">
              <div className="text-sm text-gray-500 text-center mb-2">
                Montant TTC
              </div>
              <div className="text-2xl font-bold text-center text-gray-800">
                {montantTTC}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Due Date Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-t-4 border-red-500">
            <div className="p-6">
              <div className="text-sm text-gray-500 text-center mb-3">
                الرجاء الدفع قبل
              </div>
              <div className="text-xl font-bold text-center text-gray-800">
                {datePaiement}
              </div>
            </div>
          </div>
        </div>

        {/* Next Reading Date Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-t-4 border-blue-400">
            <div className="p-6">
              <div className="text-sm text-gray-500 text-center mb-3">
                التاريخ المقبل لقراءة العداد
              </div>
              <div className="text-xl font-bold text-center text-gray-800">
                {dateLecture}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}