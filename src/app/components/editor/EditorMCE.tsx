 

import { Editor } from '@tinymce/tinymce-react'; 

export const EditorMCE = (props:any) => { 
    const {inforCompany, description, editorRef} = props;
    return ( 
        <> 
        <Editor 
           id="description" 
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={inforCompany?.description || description}
            init={{
              height: 500,
              plugins: [
                'accordion', 'advlist', 'anchor', 'autolink', 'autosave',
                'charmap', 'code', 'codesample', 'directionality', 'emoticons',
                'fullscreen', 'help', 'image', 'importcss', 'insertdatetime',
                'link', 'lists', 'media', 'nonbreaking', 'pagebreak', 'preview',
                'quickbars', 'save', 'searchreplace', 'table', 'visualblocks',
                'visualchars', 'wordcount', 'image',  
              ],  
              image_uploadtab: true,
              images_upload_url : `${process.env.NEXT_PUBLIC_API_URL}/upload-image`, 
              images_upload_credentials: true,
              toolbar:
                'undo redo | accordion accordionremove | ' +
                'blocks fontfamily fontsize | bold italic underline strikethrough | ' +
                'align numlist bullist | link image | table media | ' +
                'lineheight outdent indent | forecolor backcolor removeformat | ' +
                'charmap emoticons | code fullscreen preview | save print | ' +
                'pagebreak anchor codesample | ltr rtl',
              menubar: 'file edit view insert format tools table help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
          /> 
        </> 
    )
}