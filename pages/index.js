// import Footer from '@/components/Footer';
// import { useState } from 'react';


// export default function Home() {
//   const [imageSrc, setImageSrc] = useState();
//   const [uploadData, setUploadData] = useState();

//   function handleOnChange(changeEvent) {
//     const reader = new FileReader();

//     reader.onload = function (onLoadEvent) {
//       setImageSrc(onLoadEvent.target.result);
//       setUploadData(undefined);
//     }

//     reader.readAsDataURL(changeEvent.target.files[0]);
//   }


//   async function handleOnSubmit(event) {
//     event.preventDefault();

//     const form = event.currentTarget;
//     const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');

//     const formData = new FormData();

//     for (const file of fileInput.files) {
//       formData.append('file', file);
//     }

//     formData.append('upload_preset', 'my-uploads');

//     const data = await fetch('https://api.cloudinary.com/v1_1/dh01ngdjo/image/upload', {
//       method: 'POST',
//       body: formData
//     }).then(r => r.json());

//     setImageSrc(data.secure_url);
//     setUploadData(data);
//   }

//   return (
//     <section className='container'>
//       <h2 className='title'> PIXELART</h2>

//       <div className='containerCard' >

//         <div className='info-card'>
//           <p className='description'>
//             CODE
//           </p>
//           {uploadData && (
//             <div className='code' >
//               <code><pre>{JSON.stringify(uploadData, null, 2)}</pre></code>
//             </div>
//           )}
//         </div>

//         <form className='img-card' method="post" onChange={handleOnChange} onSubmit={handleOnSubmit}>

//           <p className='description'>
//             Upload your image here!
//           </p>

//           <input className='inputheader' type="file" name="file" />

//           <img className='imgheader' src={imageSrc} />

//           {imageSrc && !uploadData && (
//             <button className='btn-header'>Upload Image</button>
//           )}

//         </form>
//       </div>

//       <Footer />
//     </section>
//   )
// }

import Footer from '@/components/Footer';
import UploadImg from '@/components/UploadImg';
import cloudinary from 'cloudinary'


export const getServerSideProps = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.API_SECRET,
  });

  try {
    const results = await cloudinary.v2.search
      // you can add also AND tags=shirt AND uploaded_at>1d AND bytes>1m
      .expression('resource_type:image AND folder=my-uploads')
      .sort_by('uploaded_at', 'desc')
      .max_results(20)
      .execute();
    const secureUrls = results.resources.map(resource => resource.secure_url);
    return {
      props: {
        secureUrls // Pasar secureUrls como propiedad al componente homePage
      }
    }

  } catch (error) {
    console.error('Error al obtener los resultados de Cloudinary:', error);
    throw error;
  }
}

const homePage = ({ secureUrls }) => {

  return (
    <>
      <UploadImg />
      <section className='hp-container' >
        <div className='flex flex-row p-6 justify-center font-bold mb-10 text-center' >
          <h1  >GALLERY</h1>
        </div>
        <div className='pm-grid-container' >
          {secureUrls && secureUrls.map((url, index) => (
            <div key={index} className='img-content' >
              <img src={url} alt={`Imagen ${index}`} />
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>


  )
}

export default homePage
