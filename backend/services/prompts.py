PROMPT_EXERCISE_QCM = """
Génère une liste de {number_words} objets, où chaque objet possède mots en {language_a} sur le thème de {theme} puis ce mot traduis en {language_b}.

{format_instructions}

"""

PROMPT_EXERCISE_TEXT = """

Génère un long texte/article écrit en {language} sur le thème de {theme}. Ensuite, génère une liste de trois questions portant sur ce texte. Pour chaque question, indique l'intitulé de la question, la réponse correcte ainsi que trois réponses incorrectes. Le tous doit être écrit en {language}.

{format_instructions}

"""