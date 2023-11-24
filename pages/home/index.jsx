import { useState } from 'react';
import Footer from '@/components/Footer';


function homePage() {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    }

    reader.readAsDataURL(changeEvent.target.files[0]);
  }


  async function handleOnSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append('file', file);
    }

    formData.append('upload_preset', 'my-uploads');

    const data = await fetch('https://api.cloudinary.com/v1_1/dh01ngdjo/image/upload', {
      method: 'POST',
      body: formData
    }).then(r => r.json());

    setImageSrc(data.secure_url);
    setUploadData(data);
  }

  return (
    <section className='container'>
      <h2 className='title'> PIXELART</h2>

      <div className='containerCard' >

        <div className='info-card'>
          <p className='description'>
            CODE
          </p>
          {uploadData && (
            <div className='code' >
              <code><pre>{JSON.stringify(uploadData, null, 2)}</pre></code>
            </div>
          )}
        </div>

        <form className='img-card' method="post" onChange={handleOnChange} onSubmit={handleOnSubmit}>

          <p className='description'>
            Upload your image here!
          </p>

          <input className='inputheader' type="file" name="file" />

          <img className='imgheader' src={imageSrc} />

          {imageSrc && !uploadData && (
            <button className='btn-header'>Upload Image</button>
          )}

        </form>
      </div>

      <Footer />
    </section>
  )
}

export default homePage
