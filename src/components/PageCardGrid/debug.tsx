import React from 'react';
import { useAllDocsData, useDocById } from '@docusaurus/plugin-content-docs/client';

export default function PageCardGridDebug() {
  const allDocsData = useAllDocsData();
  
  // Try to get a specific document to see its full structure
  const version = allDocsData?.default?.versions?.[0];
  const firstDocEntry = version?.docs ? Object.entries(version.docs)[0] : null;
  const firstDocId = firstDocEntry ? firstDocEntry[1].id : null;
  
  let sampleDoc = null;
  try {
    sampleDoc = firstDocId ? useDocById(firstDocId) : null;
  } catch (error) {
    console.error('Error getting doc by ID:', error);
  }
  
  return (
    <div style={{ padding: '2rem', background: 'var(--elvt-alias-layout-layer-elevated)', borderRadius: '4px' }}>
      <h2>PageCardGrid Debug - useAllDocsData</h2>
      <pre style={{ fontSize: '0.8rem', overflow: 'auto', background: 'var(--elvt-alias-layout-layer-default)', padding: '1rem', borderRadius: '4px' }}>
        {JSON.stringify({
          firstDocId,
          hasSampleDoc: !!sampleDoc,
          sampleDocKeys: sampleDoc ? Object.keys(sampleDoc) : [],
          sampleDoc: sampleDoc ? {
            ...sampleDoc,
            fullStructure: sampleDoc
          } : null
        }, null, 2)}
      </pre>
    </div>
  );
}