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
      .max_results(30)
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


export default function Home({ secureUrls }) {

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


