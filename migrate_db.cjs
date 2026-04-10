const fs = require('fs');
const path = require('path');

const tablePath = path.resolve(__dirname, 'inspeccion_table.txt');
const table = fs.readFileSync(tablePath, 'utf8');

function cleanVal(v) {
    return v ? v.trim() : '';
}

const lines = table.split('\n').filter(l => l.trim().includes('|'));
console.log(`Processing ${lines.length} lines from table file...`);

const rows = [];
for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.includes(':---:') || line.includes('DATO A INSPECCIONAR')) continue;
    
    let parts = line.split('|').map(cleanVal);
    if (parts[0] === '') parts.shift();
    if (parts[parts.length - 1] === '') parts.pop();
    
    if (parts.length >= 6) {
        rows.push(parts);
    }
}
console.log(`Found ${rows.length} valid data rows.`);

function getType(t) {
    if (!t) return 'text';
    t = t.toUpperCase();
    if (t.includes('FECHA')) return 'date';
    if (t.includes('NÚMERO')) return 'number';
    if (t.includes('SI/NO') || t.includes('TRUE/FALSE') || t.includes('SI / NO')) return 'boolean';
    if (t.includes('/')) return 'select';
    return 'text';
}

function getOptions(t) {
    if (!t) return '';
    if (t.includes('/')) return t.replace(/\//g, ', ');
    return '';
}

function buildConfig(id, name, filterIdx) {
    const serviciosMap = {};
    let rowCount = 0;
    
    for (const r of rows) {
        if (r[filterIdx] && r[filterIdx].toUpperCase() === 'TRUE') {
            rowCount++;
            
            const cat = r[2] || 'GENERAL';
            const subcat = r[3];
            const subtit = r[4];
            const label = r[5];
            const dtype = r[6] || 'STRING';
            
            let srvId, srvName;
            if (cat.toUpperCase() === 'TIPOLOGÍA' || cat === '') {
                srvId = 'srv-gen';
                srvName = 'DATOS GENERALES';
            } else {
                srvId = 'srv-' + cat.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
                srvName = cat;
            }

            if (!serviciosMap[srvId]) {
                serviciosMap[srvId] = {
                    id: srvId,
                    name: srvName,
                    sections: []
                };
            }
            
            const fieldId = 'f-' + (label ? label.substring(0, 3).toLowerCase().replace(/[^\w]/g, '') : 'fld') + Math.random().toString(36).substring(2, 7);
            const field = {
                id: fieldId,
                label: label || 'Campo sin nombre',
                type: getType(dtype),
                options: getOptions(dtype)
            };
            
            // Use Subcategory or Subtitle as section, default to 'General'
            const secName = subcat || subtit || 'General';
            let foundSec = serviciosMap[srvId].sections.find(s => s.name === secName);
            if (!foundSec) {
                const secId = 'sec-' + (secName ? secName.substring(0, 3).toLowerCase().replace(/[^\w]/g, '') : 'sec') + Math.random().toString(36).substring(2, 7);
                foundSec = { id: secId, name: secName, fields: [] };
                serviciosMap[srvId].sections.push(foundSec);
            }
            foundSec.fields.push(field);
        }
    }
    
    // Final structure: services with sections (more consistent)
    const servicios = Object.values(serviciosMap);
    
    console.log(`Config for ${id}: ${rowCount} fields assigned to ${servicios.length} services.`);
    
    return {
        id: id,
        tipologia: name,
        servicios: servicios
    };
}

const clinicasConfig = buildConfig('clinicas', 'CLÍNICAS, SANATORIOS Y HOSPITALES', 0);
const geriatricosConfig = buildConfig('geriatricos', 'GERIÁTRICOS', 1);

const dbPath = path.resolve(__dirname, 'db.json');
const dbContent = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

dbContent.configuraciones_maestras = [clinicasConfig, geriatricosConfig];

fs.writeFileSync(dbPath, JSON.stringify(dbContent, null, 2), 'utf8');

console.log('Migration completed successfully with universal sections.');
