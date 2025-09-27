# stress_detector.py
# Simulates stress detection based on typing patterns.

import time

class StressDetector:
    """A class to simulate stress detection by analyzing text input."""
    
    # Constants for detection logic
    BACKSPACE_RATIO_THRESHOLD = 0.20  # Stress if 20% of chars are backspaces
    TYPING_SPEED_THRESHOLD = 15     # Stress if typing speed is below 15 chars/sec
    COOLDOWN_PERIOD = 60            # 60 seconds cooldown after detection

    def __init__(self):
        self.last_detection_time = 0
        self.reset()

    def reset(self):
        """Resets the state of the detector."""
        self.char_count = 0
        self.backspace_count = 0
        self.start_time = time.time()
        self.on_cooldown = False

    def start_cooldown(self):
        """Starts a cooldown period to prevent spamming the user."""
        self.last_detection_time = time.time()
        self.on_cooldown = True

    def _is_cooldown_active(self):
        """Checks if the cooldown period is still active."""
        if self.on_cooldown:
            if time.time() - self.last_detection_time < self.COOLDOWN_PERIOD:
                return True
            else:
                self.on_cooldown = False # Cooldown finished
        return False

    def detect_stress(self, text_input):
        """
        Analyzes a string of text to determine if the user is stressed.
        This is a simulation. A real implementation would track keyboard events.
        
        Args:
            text_input (str): The string of text entered by the user.
        
        Returns:
            bool: True if stress is detected, False otherwise.
        """
        if self._is_cooldown_active():
            return False

        # Simulate tracking backspaces (we can't actually detect them in a CLI)
        # We will assume any deletion or correction indicates a backspace in this simulation.
        # A simple proxy: look for repeated words or very short inputs.
        # A more realistic simulation for CLI would be difficult. Let's focus on length and speed.
        
        # In this simulation, we will assume a high backspace rate if the input is short.
        # This is a simplification for the CLI environment.
        current_char_count = len(text_input)
        elapsed_time = time.time() - self.start_time
        self.start_time = time.time() # Reset timer for next input

        if elapsed_time == 0:
            return False

        typing_speed = current_char_count / elapsed_time

        # Heuristic: Short input after a pause could mean deletion and retyping
        is_stressed = False
        if current_char_count < 10 and typing_speed < self.TYPING_SPEED_THRESHOLD:
             # Let's say this implies a high backspace ratio for the sake of simulation
             is_stressed = True
        
        if is_stressed:
             # Reset after detection to start fresh
             self.reset()
             return True

        return False

