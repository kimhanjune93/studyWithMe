import React, { useState } from "react";
import axios from "axios";

import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Font from "@ckeditor/ckeditor5-font/src/font";
import FontColor from "@ckeditor/ckeditor5-font/src/fontcolor.js";
import FontBackgroundColor from "@ckeditor/ckeditor5-font/src/fontbackgroundcolor";
import Link from "@ckeditor/ckeditor5-link/src/link";
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';

// import Swal from "sweetalert2";

import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";

import styled from "styled-components";

class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }
    // Starts the upload process.
    upload() {
        return this.loader.file.then(
            // file은 파일객체이다.
            file =>
                new Promise((resolve, reject) => {
                    //----사용할 데이터를 정리하고, 서버에 데이터(이미지 객체)를 전달하고 url을 얻어서 post에 저장한다.
                    const req = { img: file };

                    //multer를 사용하려면 formData 안에 request들을 넣어주어야 한다
                    let formData = new FormData();
                    for (let entry of Object.entries(req)) {
                        formData.append(entry[0], entry[1]);
                    }
                    //통신헤더설정
                    // const config = {
                    //     header: { "content-type": "multipart/form-data" },
                    // };

                    // async function sendImg() {
                    //     //서버에 파일 객체를 보내서 imgUrl을 얻어온다.
                    //     try {
                    //         const response = await axios.post(
                    //             `${process.env.REACT_APP_API_URL}util/image`,
                    //             formData,
                    //             config,
                    //         );
                    //         if (response.data.ok) {
                    //             const downloadURL = `${process.env.REACT_APP_API_URL}${response.data.result}`;
                    //             resolve({
                    //                 default: downloadURL,
                    //             });
                    //         }
                    //     } catch (err) {
                    //         Swal.fire(
                    //             "에러",
                    //             "이미지를 등록할 수 없습니다. 다시 시도해주세요!",
                    //             "error",
                    //         );
                    //     }
                    // }
                    // sendImg();
                }),
        );
    }
}

const editorConfiguration = {
  plugins: [
    Bold,
    Italic,
    Essentials,
    Heading,
    Paragraph,
    Font,
    FontColor,
    FontBackgroundColor,
    Image,
    ImageUpload,
    ImageResize,
    Link,
    MediaEmbed,
    Alignment,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
  ],
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "fontSize",
    "FontColor",
    "FontBackgroundColor",
    "|",
    "alignment",
    "Link",
    "imageUpload",
    "MediaEmbed",
  ],
  image : {
      toolbar:[
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'toggleImageCaption',
        'imageTextAlternative',
      ]
  },
  mediaEmbed: {
    previewsInData: true
  },
  heading: {
    options: [
      {
        model: "paragraph",
        view: "p",
        title: "본문",
        class: "ck-heading_paragraph",
      },
      {
        model: "heading1",
        view: "h1",
        title: "헤더1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "헤더2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "헤더3",
        class: "ck-heading_heading3",
      },
    ],
  },
  fontSize: {
    options: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  },
};
const Editor = ({getContent}) => {
  const [data, setData] = useState("");
  const handleChange = (event, editor) => {
    // setData(ReactHtmlParser(editor.getData()));
    // const a=ReactHtmlParser(editor.getData());
    setData(editor.getData());
    // console.log(a);
  };
  return (
    <>
      <StyledEditor height="500px">
        <CKEditor
          editor={ClassicEditor}
          data="<p>Hello from CKEditor 5!</p>"
          config={editorConfiguration}
          onChange={(event, editor) => {
            handleChange(event, editor);
            const data = editor.getData();
            getContent(data);
            // console.log(data);
          }}
          onReady={editor=> {
              if(editor?.plugins) {
                  editor.plugins.get(
                      "FileRepository",
                  ).createUploadAdapter = loader=>{
                      return new MyUploadAdapter(loader);
                  }
              }
          }}
        />
      </StyledEditor>
    </>
  );
};

Editor.defaultProps= {
    getContent: () => {},
}

const StyledEditor = styled.div`
    .ck-content {
        ${props => props.height && `min-height:${props.height}`}
    }
`;

//class="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred"
export default Editor;
