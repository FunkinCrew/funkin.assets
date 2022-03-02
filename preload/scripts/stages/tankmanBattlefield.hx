import flixel.math.FlxAngle;
import Paths;
import PlayState;
import flixel.FlxG;
import flixel.util.FlxTimer;
import shaderslmfao.OverlayBlend;
import play.stage.Stage;

class TankmanBattlefieldStage extends Stage
{
	public function new()
	{
		super('tankmanBattlefield');
	}

	override function buildStage()
	{
		super.buildStage();

		// Give the clouds a random position, and a velocity to make them move.
		var clouds = getNamedProp('clouds');
		clouds.active = true;
		clouds.x = FlxG.random.int(-700, -100);
		clouds.y = FlxG.random.int(-20, 20);
		clouds.velocity.x = FlxG.random.float(5, 15);
	}

	override function onUpdate(elapsed:Float):Void
	{
		moveTank();
	}

	var tankResetShit:Bool = false;
	var tankMoving:Bool = false;
	var tankAngle:Float = FlxG.random.int(-90, 45);
	var tankSpeed:Float = FlxG.random.float(5, 7);
	var tankX:Float = 400;

	function moveTank():Void
	{
		var daAngleOffset:Float = 1;
		tankAngle += FlxG.elapsed * tankSpeed;

		var tankRolling = getNamedProp('tankRolling');
		tankRolling.angle = tankAngle - 90 + 15;
		tankRolling.x = tankX + Math.cos(FlxAngle.asRadians((tankAngle * daAngleOffset) + 180)) * 1500;
		tankRolling.y = 1300 + Math.sin(FlxAngle.asRadians((tankAngle * daAngleOffset) + 180)) * 1100;
	}

	override function kill():Void {}
}
