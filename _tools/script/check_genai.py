import google.generativeai as genai
import textwrap

print(f"Has ImageGenerationModel: {'ImageGenerationModel' in dir(genai)}")
print("Attributes:")
print(textwrap.fill(str(dir(genai)), width=80))
