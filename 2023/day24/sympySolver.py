# source .venv/bin/activate

from sympy import symbols, solve

x,y,z,a,b,c = symbols('x y z a b c')

eqs = [(308205470708820-x)*(274-b)-(42-a)*(82023714100543-y),
(82023714100543-y)*(-194-c)-(274-b)*(475164418926765-z),
(242904857760501-x)*(-69-b)-(147-a)*(351203053017504-y),
(351203053017504-y)*(131-c)-(-69-b)*(247366253386570-z),
(258124591360173-x)*(-5-b)-(-84-a)*(252205185038992-y),
(252205185038992-y)*(409-c)-(-5-b)*(113896142591148-z)]

answers = solve(eqs)

answer = [s for s in answers if all(x%1==0 for x in s.values())][0]

print(answer[x]+answer[y]+answer[z])

# correct answer 557743507346379cd 202