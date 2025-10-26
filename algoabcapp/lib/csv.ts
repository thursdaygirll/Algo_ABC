import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParsedData {
  matrix: number[][];
  alternatives: string[];
  criteria: string[];
  rows: number;
  cols: number;
}

export function parseCSV(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        try {
          const data = results.data as string[][];
          const alternatives = data.slice(1).map(row => row[0]).filter(Boolean);
          const criteria = data[0].slice(1).filter(Boolean);
          
          const matrix = data.slice(1).map(row => 
            row.slice(1).map(cell => parseFloat(cell) || 0)
          ).filter(row => row.length === criteria.length);
          
          resolve({
            matrix,
            alternatives,
            criteria,
            rows: matrix.length,
            cols: criteria.length
          });
        } catch (error) {
          reject(new Error('Failed to parse CSV file'));
        }
      },
      error: (error) => {
        reject(new Error('Failed to parse CSV file'));
      }
    });
  });
}

export function parseExcel(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        const alternatives = jsonData.slice(1).map(row => String(row[0] || '')).filter(Boolean);
        const criteria = jsonData[0].slice(1).map(String).filter(Boolean);
        
        const matrix = jsonData.slice(1).map(row => 
          row.slice(1).map(cell => parseFloat(cell) || 0)
        ).filter(row => row.length === criteria.length);
        
        resolve({
          matrix,
          alternatives,
          criteria,
          rows: matrix.length,
          cols: criteria.length
        });
      } catch (error) {
        reject(new Error('Failed to parse Excel file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read Excel file'));
    reader.readAsBinaryString(file);
  });
}

export function generateRandomMatrix(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () => 
    Array.from({ length: cols }, () => Math.random())
  );
}
