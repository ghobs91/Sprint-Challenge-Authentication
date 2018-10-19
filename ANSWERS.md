<!-- Answers to the Short Answer Essay Questions go here -->

1. What is the purpose of using _sessions_?
Sessions allow users to access protected content without having to constantly re-authenticate.

2. What does bcrypt do to help us store passwords in a secure manner.
It has an algorithm that salts and hashes passwords with multiple rounds.

3. What does bcrypt do to slow down attackers?
It requires attackers to have the hash, know the algorithm used, and how many rounds were used to generate the hash in the first place.

4. What are the three parts of the JSON Web Token?
The header, payload, and signature.