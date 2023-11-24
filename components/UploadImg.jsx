import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadImg() {
    const [imageSrc, setImageSrc] = useState();
    const [uploadData, setUploadData] = useState();

    const router = useRouter()

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
        setTimeout(() => {
            router.refresh()
        }, 2000);

    }

    return (
        <section className='container'>
            <h2 className='title'> PIXELART</h2>


            <form className='img-card' method="post" onChange={handleOnChange} onSubmit={handleOnSubmit}>

                <div className='upi-container' >
                    <p className='description'>
                        Share Photos
                    </p>
                    <div className='flex flex-col' >
                        <label htmlFor='archivo' className="custom-file-upload"  >Select from computer</label>
                        <input id="archivo" className="input-file" type="file" name="file" />
                    </div>
                    {imageSrc && !uploadData && (
                        <button className='btn-header'>Upload Image</button>
                    )}
                </div>
                <div>
                    <img className='imgheader' src={imageSrc} />
                </div>


            </form>
        </section>
    )
}
