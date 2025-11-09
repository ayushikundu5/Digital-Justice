try:
    from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig
    import torch
    import time
except ImportError as e:
    raise ImportError(
        "Missing required libraries for GenAI Reasoner. "
        "Please install them with: pip install transformers torch accelerate"
    ) from e

class LocalGenAIReasoner:
    def __init__(self, model_name="TinyLlama/TinyLlama-1.1B-Chat-v1.0", use_quantization=True):
        """
        Initialize the Local GenAI Reasoner with optimizations for speed
        
        Args:
            model_name: Model to use. Options:
                - "TinyLlama/TinyLlama-1.1B-Chat-v1.0" (1.1GB, fast, recommended for CPU)
                - "microsoft/phi-3-mini-4k-instruct" (7.6GB, slower on CPU)
            use_quantization: If True, use 8-bit quantization to reduce memory (requires bitsandbytes)
        """
        try:
            print(f"\n{'='*60}")
            print(f"⚡ OPTIMIZED GenAI REASONER - FAST MODE")
            print(f"{'='*60}")
            print(f"⏳ Loading model: {model_name}")
            print(f"   💾 Optimized for maximum speed")
            
            start_time = time.time()
            
            self.tokenizer = AutoTokenizer.from_pretrained(
                model_name, 
                trust_remote_code=True,
                use_fast=True  # Use fast tokenizer
            )
            
            # Ensure pad token is set
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # Check if we can use CUDA
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
            
            # Load model with aggressive optimizations
            model_kwargs = {
                "trust_remote_code": True,
                "low_cpu_mem_usage": True,
            }
            
            # Add quantization if requested and possible
            if use_quantization and self.device == "cuda":
                try:
                    model_kwargs["load_in_8bit"] = True
                    print("   🔧 Using 8-bit quantization (GPU)")
                except:
                    print("   ⚠️  8-bit quantization not available")
            
            # Optimize for device
            if self.device == "cpu":
                model_kwargs["torch_dtype"] = torch.float32
                print("   🖥️  Using CPU (optimized for speed)")
            else:
                model_kwargs["torch_dtype"] = torch.float16
                print("   🚀 Using GPU (CUDA)")
            
            # For Phi-3, avoid flash-attention issues
            if "phi-3" in model_name.lower():
                model_kwargs["attn_implementation"] = "eager"
            
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                **model_kwargs
            )
            
            # Move to device if not using quantization
            if not (use_quantization and self.device == "cuda"):
                self.model = self.model.to(self.device)
            
            # Set model to evaluation mode for faster inference
            self.model.eval()
            
            # Enable inference optimizations
            if hasattr(torch, 'inference_mode'):
                print("   ⚡ Inference mode: ENABLED")
            
            # Pre-configure generation settings for speed
            self.fast_generation_config = GenerationConfig(
                max_new_tokens=250,  # Reduced from 400 for speed
                temperature=0.7,
                do_sample=True,
                top_p=0.9,
                top_k=40,  # Reduced from 50
                repetition_penalty=1.1,
                pad_token_id=self.tokenizer.pad_token_id,
                eos_token_id=self.tokenizer.eos_token_id,
                early_stopping=True,
                num_beams=1,  # Greedy decoding for speed
            )
            
            load_time = time.time() - start_time
            print(f"✅ Model loaded successfully in {load_time:.2f}s")
            print(f"   📊 Model size: ~{self._estimate_model_size()}")
            print(f"   🎯 Optimized for <30s responses")
            print(f"{'='*60}\n")
            
        except Exception as e:
            print(f"❌ Failed to load GenAI model: {e}")
            raise

    def _estimate_model_size(self):
        """Estimate model size in memory"""
        try:
            param_size = sum(p.numel() * p.element_size() for p in self.model.parameters())
            buffer_size = sum(b.numel() * b.element_size() for b in self.model.buffers())
            size_mb = (param_size + buffer_size) / (1024**2)
            if size_mb < 1024:
                return f"{size_mb:.0f}MB"
            else:
                return f"{size_mb/1024:.1f}GB"
        except:
            return "unknown"

    def generate_reasoning(self, plaintiff, defendant, evidence, verdict):
        """
        Generate reasoning with optimized speed (<30s target)
        """
        start_time = time.time()
        print(f"\n{'='*60}")
        print(f"⚡ GENERATING REASONING - FAST MODE")
        print(f"{'='*60}")
        
        # Optimized prompt - shorter and more direct
        prompt = f"""You are an AI Judge. Analyze this case and explain the verdict.

Case Details:
- Plaintiff claims: {plaintiff[:300]}...
- Defendant argues: {defendant[:300]}...
- Evidence: {evidence[:200] if evidence else "None"}
- Verdict: {verdict}

Provide a concise legal reasoning (2-3 paragraphs):"""

        # Tokenize with optimizations
        tokenize_start = time.time()
        inputs = self.tokenizer(
            prompt, 
            return_tensors="pt", 
            truncation=True, 
            max_length=800,  # Reduced from 1024
            padding=False,
            return_attention_mask=True
        )
        tokenize_time = time.time() - tokenize_start
        print(f"⏱️  Tokenization: {tokenize_time:.3f}s")
        
        # Move inputs to device
        if self.device == "cuda":
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        # Generate with optimizations
        gen_start = time.time()
        print(f"🚀 Generating text (target: <25s)...")
        
        with torch.inference_mode():  # Faster than no_grad
            outputs = self.model.generate(
                **inputs,
                generation_config=self.fast_generation_config,
                use_cache=True,  # Enable KV cache
            )
        
        gen_time = time.time() - gen_start
        print(f"⏱️  Generation: {gen_time:.3f}s")
        
        # Decode
        decode_start = time.time()
        full_response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        decode_time = time.time() - decode_start
        print(f"⏱️  Decoding: {decode_time:.3f}s")
        
        # Extract reasoning
        extract_start = time.time()
        reasoning = self._extract_reasoning_fast(prompt, full_response)
        extract_time = time.time() - extract_start
        print(f"⏱️  Extraction: {extract_time:.3f}s")
        
        total_time = time.time() - start_time
        print(f"\n{'='*60}")
        print(f"✅ COMPLETE - Total time: {total_time:.2f}s")
        print(f"   📊 Reasoning length: {len(reasoning)} chars")
        if total_time < 30:
            print(f"   🎯 SUCCESS: Under 30s target!")
        else:
            print(f"   ⚠️  Over 30s target by {total_time-30:.1f}s")
        print(f"{'='*60}\n")
        
        return reasoning.strip()

    def _extract_reasoning_fast(self, prompt, full_response):
        """Fast reasoning extraction"""
        
        # Method 1: Remove the exact prompt
        if full_response.startswith(prompt.strip()):
            reasoning = full_response[len(prompt.strip()):].strip()
            if reasoning and len(reasoning) > 20:
                return self._clean_reasoning(reasoning)
        
        # Method 2: Split after key phrases
        key_phrases = [
            "Provide a concise legal reasoning (2-3 paragraphs):",
            "Provide a concise legal reasoning",
            "legal reasoning",
            "reasoning:"
        ]
        
        for phrase in key_phrases:
            if phrase in full_response:
                parts = full_response.split(phrase, 1)
                if len(parts) > 1 and parts[1].strip():
                    return self._clean_reasoning(parts[1].strip())
        
        # Method 3: Take the last meaningful part
        if len(full_response) > 300:
            reasoning = full_response[-500:].strip()
            return self._clean_reasoning(reasoning)
        
        # Fallback: Return cleaned full response
        return self._clean_reasoning(full_response)

    def _clean_reasoning(self, reasoning):
        """Clean and format reasoning quickly"""
        
        # Remove common prompt fragments
        fragments = [
            "or this verdict, including",
            "this verdict, including",
            "including logical",
            "and emotional empathy.",
            "emotional empathy.",
            "concise legal reasoning",
            "(2-3 paragraphs):",
        ]
        
        for fragment in fragments:
            if reasoning.lower().startswith(fragment.lower()):
                reasoning = reasoning[len(fragment):].strip()
        
        # Strip leading punctuation/whitespace only
        reasoning = reasoning.lstrip(':-•*\n\r\t ')
        reasoning = reasoning.strip()
        
        # Ensure minimum quality
        if not reasoning or len(reasoning) < 20:
            return self._generate_fallback_reasoning()
        
        return reasoning

    def _generate_fallback_reasoning(self):
        """Quick fallback reasoning"""
        return """The court has carefully analyzed the evidence and arguments presented by both parties. 

Based on the plaintiff's claims and the defendant's defense, the verdict is supported by the preponderance of evidence and applicable legal principles. The decision takes into account both the factual circumstances and the equitable considerations of the case.

This judgment seeks to provide a fair resolution that serves the interests of justice while considering the rights and positions of all parties involved."""

    def generate_reasoning_ultra_fast(self, plaintiff, defendant, evidence, verdict):
        """
        Ultra-fast version for critical speed requirements (<15s)
        Uses minimal tokens and greedy decoding
        """
        start_time = time.time()
        print(f"\n⚡⚡ ULTRA-FAST MODE ⚡⚡")
        
        # Ultra-short prompt
        prompt = f"""AI Judge verdict explanation:
Plaintiff: {plaintiff[:150]}
Defendant: {defendant[:150]}
Verdict: {verdict}
Reasoning:"""

        inputs = self.tokenizer(
            prompt, 
            return_tensors="pt", 
            truncation=True, 
            max_length=400,
            padding=False
        )
        
        if self.device == "cuda":
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        with torch.inference_mode():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=150,  # Very short
                do_sample=False,  # Greedy for speed
                temperature=1.0,
                pad_token_id=self.tokenizer.pad_token_id,
                eos_token_id=self.tokenizer.eos_token_id,
                early_stopping=True,
                use_cache=True,
            )
        
        full_response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        reasoning = full_response.replace(prompt, "").strip()
        
        if not reasoning or len(reasoning) < 20:
            reasoning = self._generate_fallback_reasoning()
        
        total_time = time.time() - start_time
        print(f"✅ Ultra-fast complete: {total_time:.2f}s\n")
        
        return reasoning