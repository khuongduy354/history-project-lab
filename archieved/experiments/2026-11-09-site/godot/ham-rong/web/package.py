"""Package the single-thread Godot Web export for static hosting. No remote runtime dependencies."""
import gzip,shutil,sys,zipfile
from pathlib import Path
from PIL import Image
source=Path(__file__).resolve().parents[1]
export=Path(sys.argv[1]).resolve()
dist=Path(sys.argv[2]).resolve()
d=dist/'ham-rong';d.mkdir(parents=True,exist_ok=True)
for f in export.glob('index.*'):
 if f.suffix!='.wasm':shutil.copyfile(f,d/f.name)
wasm=(export/'index.wasm').read_bytes()
(d/'engine.bin').write_bytes(gzip.compress(wasm,compresslevel=6,mtime=0))
# Use explicit decompression instead of depending on static-host encoding metadata.
# Older Android WebViews use a bundled MIT-licensed JS gzip decoder.
for name in ['fflate.min.js','fflate-LICENSE.txt']:
 shutil.copy(source/'web'/name,d/name)
p=d/'index.js';js=p.read_text();needle='return fetch(file).then(function (response) {'
assert js.count(needle)==1
replacement="""return (file.endsWith('.wasm') ? (async function(){
 const headers={'Content-Type':'application/wasm','Content-Length':'WASMSIZE'};
 const r=await fetch('engine.bin');if(!r.ok)throw Error('Không tải được engine');
 if(typeof DecompressionStream==='function')return new Response(r.body.pipeThrough(new DecompressionStream('gzip')),{headers});
 await new Promise((resolve,reject)=>{let s=document.createElement('script');s.src='fflate.min.js';s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
 return new Response(fflate.gunzipSync(new Uint8Array(await r.arrayBuffer())),{headers});
 })():fetch(file)).then(function (response) {""".replace('WASMSIZE',str(len(wasm)))
p.write_text(js.replace(needle,replacement))
p=d/'index.html';s=p.read_text().replace('<title>Cánh én Hàm Rồng</title>','<title>Cánh én Hàm Rồng</title>').replace('Error\u005cnThe following features required to run Godot projects on the Web are missing:', 'Trình duyệt thiếu tính năng đồ họa để mở game:');p.write_text(s)
for page in ['ham-rong.html','cho-gao.html']:
 shutil.copy(source/'web/ham-rong.html',dist/page)
Image.open(source/'art/convoy/lane-0.webp').resize((850,850)).save(d/'cover.webp',quality=81)
shutil.copy(source/'art/convoy/unit-0.webp',d/'xe-tho.webp')
with zipfile.ZipFile(d/'source.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in sorted(source.rglob('*')):
  rel=f.relative_to(source)
  if f.is_file() and not set(rel.parts)&{'.godot','build','__pycache__'}:
   z.write(f,str(Path('ham-rong')/rel))
