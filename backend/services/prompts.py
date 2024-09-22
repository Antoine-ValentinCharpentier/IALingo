PROMPT_EXERCISE_QCM = """
Génère une liste de {number_words} objets, où chaque objet possède mots en {language_a} sur le thème de {theme} puis ce mot traduis en {language_b}.

{format_instructions}

"""

PROMPT_EXERCISE_TEXT = """

Tu es un professeur de {language} et tu aimerais évaluer tes étudiants sur une compréhension écrite. 

Premièrement, tu dois donc générer sur un article de plus de 200 mots, écrit en {language} sur le thème de {theme}. 

Deuxièmement, tu dois génèrer une liste de 3 questions portant sur cet article. Pour chaque question, indique l'intitulé de la question, la réponse correcte ainsi que trois réponses incorrectes.

L'article, les questions, les réponses doivent être écrit en {language}.

{format_instructions}

"""