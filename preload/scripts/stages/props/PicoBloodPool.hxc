import funkin.graphics.adobeanimate.FlxAtlasSprite;
import flixel.math.FlxPoint;
import flixel.FlxSprite;
import funkin.graphics.FunkinSprite;
import funkin.play.PlayState;
import flixel.util.FlxTimer;
import flixel.FlxG;
import funkin.audio.FunkinSound;

class PicoBloodPool extends FlxAtlasSprite
{

  public function new(x:Float, y:Float)
  {
    super(x, y, Paths.animateAtlas("philly/erect/bloodPool", "week3"), {
      FrameRate: 24.0,
      Reversed: false,
      // ?OnComplete:Void -> Void,
      ShowPivot: false,
      Antialiasing: true,
      ScrollFactor: new FlxPoint(1, 1),
    });

   // onAnimationFinish.add(finishCanAnimation);
    this.visible = false;
  }

  public function doAnim(){
    playAnimation("poolAnim", true, false, false);
    //backingTextYeah.anim.play("");
    this.visible = true;
  }
}
