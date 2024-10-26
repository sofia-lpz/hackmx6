from openai import OpenAI
import sounddevice as sd
import soundfile as sf
import os

class SpanishTTS:
    def __init__(self):
        self.client = OpenAI()
        
    def text_to_speech(self, text, voice="nova"):
        """Convert text to speech and play it immediately"""
        try:
            # Generate speech with streaming
            response = self.client.audio.speech.create(
                model="tts-1-hd",
                voice=voice,
                input=text
            )
            
            # Save temporarily and play
            temp_file = "temp_speech.mp3"
            
            # Stream the response content
            with open(temp_file, 'wb') as f:
                for chunk in response.iter_bytes():
                    f.write(chunk)
            
            # Read and play audio
            audio_data, sample_rate = sf.read(temp_file)
            sd.play(audio_data, sample_rate)
            sd.wait()
            
            # Cleanup
            os.remove(temp_file)
            
        except Exception as e:
            print(f"Error: {e}")

def main():
    tts = SpanishTTS()
    
    print("Spanish Text-to-Speech (press Ctrl+C to exit)")
    print("Enter your text (it will be converted to Spanish TTS):")
    
    while True:
        try:
            text = input("> ")
            if text.lower().strip() == 'exit':
                break
                
            tts.text_to_speech(text)
            
        except KeyboardInterrupt:
            print("\nExiting...")
            break
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()