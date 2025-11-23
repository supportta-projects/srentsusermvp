/**
 * Firestore Structure Analysis Script
 * 
 * SAFE READ-ONLY SCRIPT
 * - Only reads collection and document structure
 * - Does NOT expose sensitive data values
 * - Only shows field names and types
 * - Safe to run on production database
 */

import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import * as fs from 'fs';
import * as path from 'path';

interface FieldInfo {
  name: string;
  type: string;
  isArray: boolean;
  arrayItemType?: string;
  isObject: boolean;
  objectKeys?: string[];
  isOptional: boolean;
}

interface CollectionStructure {
  name: string;
  documentCount: number | string;
  sampleDocumentId?: string;
  fields: FieldInfo[];
  hasData: boolean;
  error?: string;
}

interface FirestoreAnalysis {
  projectId: string;
  analyzedAt: string;
  collections: CollectionStructure[];
  summary: {
    totalCollections: number;
    collectionsWithData: number;
    totalDocuments: number;
  };
}

function getFieldType(value: any): { type: string; isArray: boolean; arrayItemType?: string; isObject: boolean; objectKeys?: string[] } {
  if (value === null || value === undefined) {
    return { type: 'null', isArray: false, isObject: false };
  }
  
  if (Array.isArray(value)) {
    const itemType = value.length > 0 ? typeof value[0] : 'any';
    return { 
      type: 'array', 
      isArray: true, 
      arrayItemType: itemType,
      isObject: false 
    };
  }
  
  if (value instanceof Date || (typeof value === 'object' && value.constructor?.name === 'Timestamp')) {
    return { type: 'timestamp', isArray: false, isObject: false };
  }
  
  if (typeof value === 'object' && value !== null) {
    const keys = Object.keys(value);
    return { 
      type: 'object', 
      isArray: false, 
      isObject: true,
      objectKeys: keys.length > 0 ? keys : undefined
    };
  }
  
  return { type: typeof value, isArray: false, isObject: false };
}

async function analyzeCollection(collectionName: string): Promise<CollectionStructure> {
  try {
    const colRef = collection(db, collectionName);
    
    // Get limited sample (only 1 document for structure analysis)
    const q = query(colRef, limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return {
        name: collectionName,
        documentCount: 0,
        fields: [],
        hasData: false
      };
    }
    
    // Get full count (limited to avoid performance issues)
    const fullSnapshot = await getDocs(query(colRef, limit(100)));
    const documentCount = fullSnapshot.size;
    
    // Analyze first document structure
    const firstDoc = snapshot.docs[0];
    const data = firstDoc.data();
    
    const fields: FieldInfo[] = [];
    const fieldNames = Object.keys(data);
    
    for (const fieldName of fieldNames) {
      const value = data[fieldName];
      const typeInfo = getFieldType(value);
      
      fields.push({
        name: fieldName,
        type: typeInfo.type,
        isArray: typeInfo.isArray,
        arrayItemType: typeInfo.arrayItemType,
        isObject: typeInfo.isObject,
        objectKeys: typeInfo.objectKeys,
        isOptional: value === null || value === undefined
      });
    }
    
    return {
      name: collectionName,
      documentCount: documentCount >= 100 ? `${documentCount}+` : documentCount.toString(),
      sampleDocumentId: firstDoc.id,
      fields: fields.sort((a, b) => a.name.localeCompare(b.name)),
      hasData: true
    };
  } catch (error: any) {
    return {
      name: collectionName,
      documentCount: 0,
      fields: [],
      hasData: false,
      error: error.message || 'Unknown error'
    };
  }
}

async function analyzeFirestoreStructure() {
  console.log('🔍 Firestore Structure Analysis');
  console.log('================================\n');
  console.log('⚠️  This script is READ-ONLY and SAFE');
  console.log('   - Only reads structure (field names and types)');
  console.log('   - Does NOT expose sensitive data values\n');
  
  // List of collections to analyze
  const collectionsToAnalyze = [
    // Existing vendor app collections
    'rental_shops',
    'rental_products',
    'rental_orders',
    'rental_customers',
    'rental_staff',
    'rental_brands',
    'rental_categories',
    'global_customers',
    'company_settings',
    
    // Check for vendor collection
    'vendors',
    'vendor_subscriptions',
    
    // Marketplace collections (this project)
    'shops',
    'products',
    'customers',
    'contacts',
  ];

  const results: CollectionStructure[] = [];
  let totalDocuments = 0;
  let collectionsWithData = 0;

  console.log(`Analyzing ${collectionsToAnalyze.length} collections...\n`);

  for (const collectionName of collectionsToAnalyze) {
    process.stdout.write(`  Analyzing ${collectionName}... `);
    
    const structure = await analyzeCollection(collectionName);
    results.push(structure);
    
    if (structure.hasData && !structure.error) {
      const count = typeof structure.documentCount === 'string' 
        ? parseInt(structure.documentCount.replace('+', '')) || 0
        : structure.documentCount;
      totalDocuments += count;
      collectionsWithData++;
      console.log(`✅ ${structure.documentCount} documents, ${structure.fields.length} fields`);
    } else if (structure.error) {
      console.log(`❌ Error: ${structure.error}`);
    } else {
      console.log(`⚠️  Empty collection`);
    }
  }

  // Create analysis report
  const analysis: FirestoreAnalysis = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'unknown',
    analyzedAt: new Date().toISOString(),
    collections: results,
    summary: {
      totalCollections: collectionsToAnalyze.length,
      collectionsWithData: collectionsWithData,
      totalDocuments: totalDocuments
    }
  };

  // Save to file
  const outputPath = path.join(process.cwd(), 'firestore-structure-analysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));

  // Print summary
  console.log('\n📊 Analysis Summary');
  console.log('==================');
  console.log(`Total Collections Analyzed: ${analysis.summary.totalCollections}`);
  console.log(`Collections with Data: ${analysis.summary.collectionsWithData}`);
  console.log(`Total Documents Found: ${analysis.summary.totalDocuments}`);
  console.log(`\n✅ Full report saved to: firestore-structure-analysis.json\n`);

  // Print detailed structure
  console.log('📋 Collection Structures:');
  console.log('=========================\n');
  
  for (const collection of results) {
    if (collection.hasData && !collection.error) {
      console.log(`\n📁 ${collection.name}`);
      console.log(`   Documents: ${collection.documentCount}`);
      console.log(`   Sample ID: ${collection.sampleDocumentId}`);
      console.log(`   Fields (${collection.fields.length}):`);
      
      for (const field of collection.fields) {
        let typeStr = field.type;
        if (field.isArray) {
          typeStr = `array<${field.arrayItemType || 'any'}>`;
        } else if (field.isObject) {
          typeStr = `object${field.objectKeys ? ` {${field.objectKeys.join(', ')}}` : ''}`;
        }
        
        const optional = field.isOptional ? ' (optional)' : '';
        console.log(`     - ${field.name}: ${typeStr}${optional}`);
      }
    } else if (collection.error) {
      console.log(`\n❌ ${collection.name}: ${collection.error}`);
    } else {
      console.log(`\n⚠️  ${collection.name}: Empty collection`);
    }
  }

  console.log('\n✅ Analysis complete!');
  console.log(`📄 Full JSON report: ${outputPath}`);
  console.log('\n💡 Share the firestore-structure-analysis.json file for detailed analysis.\n');

  return analysis;
}

// Run analysis
analyzeFirestoreStructure()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error running analysis:', error);
    process.exit(1);
  });

