# Downloads the free Kokoro voice model (Heart voice) into vid/tts and vid2/tts.
import urllib.request, shutil, os
BASE="https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/"
for src,dst in (("kokoro-v1.0.onnx","kokoro.onnx"),("voices-v1.0.bin","voices.bin")):
    p=os.path.join("vid","tts",dst)
    if not os.path.exists(p):
        print("downloading",src); urllib.request.urlretrieve(BASE+src,p)
    shutil.copy(p,os.path.join("vid2","tts",dst))
print("voice model ready")
